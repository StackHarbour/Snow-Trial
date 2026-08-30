import type { Alert, ForecastResult, HourlyForecast, PrecipitationType } from '@/domain/forecast/types';
import type { CanonicalLocation } from '@/domain/location/types';
import { evaluateConfidence, inchesFromNwsUnit } from '@/domain/forecast/calculations';
import { fetchJson, env } from '@/lib/http';
import type { AlertProvider, ForecastProvider } from './types';

const NWS = 'https://api.weather.gov';
const USER_AGENT = env('NWS_USER_AGENT') ?? 'Snow Trail/0.1 (contact@example.com)';

interface NwsPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations?: string;
    gridId?: string;
    gridX?: number;
    gridY?: number;
    timeZone?: string;
  };
}

interface NwsHourlyPeriod {
  startTime: string;
  endTime: string;
  temperature: number;
  temperatureUnit: 'F' | 'C';
  windSpeed?: string;
  shortForecast: string;
  probabilityOfPrecipitation?: { value?: number };
}

interface NwsHourly { properties: { updateTime: string; periods: NwsHourlyPeriod[] } }
interface NwsGridSeries { uom?: string; values?: Array<{ validTime: string; value: number | null }> }
interface NwsGrid { properties: { updateTime: string; snowfallAmount?: NwsGridSeries; snowLevel?: NwsGridSeries } }
interface NwsObservation { properties: { timestamp?: string; temperature?: { value?: number }; textDescription?: string; windSpeed?: { value?: number } } }

interface NwsAlerts { features?: Array<{ id?: string; properties: { event?: string; severity?: string; areaDesc?: string; senderName?: string; sent?: string; effective?: string; expires?: string; description?: string } }> }

function parseMph(value?: string): number | undefined {
  if (!value) return undefined;
  const match = value.match(/([\d.]+)/);
  return match ? Number(match[1]) : undefined;
}

function parseIntervalStart(validTime: string): Date {
  return new Date(validTime.split('/')[0]);
}

function intervalEnd(validTime: string): Date {
  const [, duration] = validTime.split('/');
  const start = parseIntervalStart(validTime);
  if (!duration) return start;
  const m = duration.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/);
  if (!m) return start;
  const days = Number(m[1] ?? 0);
  const hours = Number(m[2] ?? 0);
  const minutes = Number(m[3] ?? 0);
  return new Date(start.getTime() + (((days * 24 + hours) * 60 + minutes) * 60_000));
}

function valueAtTime(series: NwsGridSeries | undefined, time: string): number | undefined {
  if (!series?.values) return undefined;
  const target = new Date(time).getTime();
  const match = series.values.find((item) => {
    const start = parseIntervalStart(item.validTime).getTime();
    const end = intervalEnd(item.validTime).getTime();
    return target >= start && target < end;
  });
  return match?.value ?? undefined;
}

function precipType(text: string): PrecipitationType {
  const s = text.toLowerCase();
  if (s.includes('freezing rain') || s.includes('freezing drizzle')) return 'freezing-rain';
  if (s.includes('sleet') || s.includes('ice pellets')) return 'sleet';
  if (s.includes('snow')) {
    if (s.includes('rain') || s.includes('mixed')) return 'mixed';
    return 'snow';
  }
  if (s.includes('rain')) return 'rain';
  return 'unknown';
}

function toInches(value: number | undefined, uom?: string): number | undefined {
  if (value === undefined) return undefined;
  return inchesFromNwsUnit(value, uom ?? 'in');
}

function toFeet(value: number | undefined, uom?: string): number | undefined {
  if (value === undefined) return undefined;
  const unit = (uom ?? '').toLowerCase();
  if (unit.includes('ft')) return value;
  if (unit.includes('m')) return value * 3.28084;
  if (unit.includes('cm')) return value / 30.48;
  if (unit.includes('in')) return value / 12;
  return value;
}

export class NwsProvider implements ForecastProvider, AlertProvider {
  private headers() { return { 'User-Agent': USER_AGENT, Accept: 'application/geo+json, application/json' }; }

  async getForecast(location: CanonicalLocation): Promise<ForecastResult> {
    const retrievedAt = new Date().toISOString();
    const point = await fetchJson<NwsPoint>(`${NWS}/points/${location.latitude},${location.longitude}`, { headers: this.headers() });
    const [hourly, grid] = await Promise.all([
      fetchJson<NwsHourly>(point.data.properties.forecastHourly, { headers: this.headers() }),
      fetchJson<NwsGrid>(point.data.properties.forecastGridData, { headers: this.headers() }),
    ]);

    const periods = hourly.data.properties.periods.slice(0, 168);
    const snowfall = grid.data.properties.snowfallAmount;
    const snowLevel = grid.data.properties.snowLevel;
    const forecastHours: HourlyForecast[] = periods.map((period) => {
      const snow = toInches(valueAtTime(snowfall, period.startTime), snowfall?.uom);
      return {
        time: period.startTime,
        temperatureF: period.temperatureUnit === 'F' ? period.temperature : (period.temperature * 9) / 5 + 32,
        snowfallIn: snow,
        snowfallRateInPerHour: snow !== undefined ? snow / Math.max(1, (new Date(period.endTime).getTime() - new Date(period.startTime).getTime()) / 3_600_000) : undefined,
        precipitationProbability: period.probabilityOfPrecipitation?.value,
        precipitationType: precipType(period.shortForecast),
        windMph: parseMph(period.windSpeed),
        snowLevelFt: toFeet(valueAtTime(snowLevel, period.startTime), snowLevel?.uom),
        condition: period.shortForecast,
      };
    });

    const stationUrl = point.data.properties.observationStations;
    let current: ForecastResult['current'] = { condition: 'Current observations unavailable' };
    if (stationUrl) {
      try {
        const stations = await fetchJson<{ features?: Array<{ id: string }> }>(stationUrl, { headers: this.headers() });
        const stationId = stations.data.features?.[0]?.id;
        if (stationId) {
          const obs = await fetchJson<NwsObservation>(`${stationId}/observations/latest`, { headers: this.headers() });
          const c = obs.data.properties.temperature?.value;
          current = {
            temperatureF: c !== undefined ? (c * 9) / 5 + 32 : undefined,
            condition: obs.data.properties.textDescription ?? 'Current observation',
            windMph: obs.data.properties.windSpeed?.value !== undefined ? obs.data.properties.windSpeed.value * 2.236936 : undefined,
            observationTime: obs.data.properties.timestamp,
          };
        }
      } catch {
        // Forecast remains useful if observations fail.
      }
    }

    const next24 = forecastHours.slice(0, 24).reduce((s, h) => s + (h.snowfallIn ?? 0), 0);
    const next3d = forecastHours.slice(0, 72).reduce((s, h) => s + (h.snowfallIn ?? 0), 0);
    const next7d = forecastHours.reduce((s, h) => s + (h.snowfallIn ?? 0), 0);
    const snowHours = forecastHours.filter((h) => h.precipitationType === 'snow' || h.precipitationType === 'mixed');
    const snowProbability = snowHours.length ? Math.max(...snowHours.map((h) => h.precipitationProbability ?? 0)) : undefined;
    const missingSnowHours = forecastHours.filter((h) => h.snowfallIn === undefined).length;
    const updatedAt = grid.data.properties.updateTime || hourly.data.properties.updateTime;
    const ageMin = Math.max(0, (Date.now() - new Date(updatedAt).getTime()) / 60_000);
    const confidence = evaluateConfidence({ horizonHours: 168, sourceCount: 1, dataFreshnessMinutes: ageMin, missingSnowHours });

    return {
      location,
      current,
      hourly: forecastHours,
      snow: {
        next6hIn: forecastHours.slice(0, 6).reduce((s, h) => s + (h.snowfallIn ?? 0), 0),
        next12hIn: forecastHours.slice(0, 12).reduce((s, h) => s + (h.snowfallIn ?? 0), 0),
        next24hIn: next24,
        next3dIn: next3d,
        next7dIn: next7d,
        snowfallProbability: snowProbability,
        precipitationProbability: Math.max(...forecastHours.slice(0, 24).map((h) => h.precipitationProbability ?? 0)),
      },
      confidence,
      freshness: { retrievedAt, providerUpdatedAt: updatedAt, isStale: ageMin > 180 },
      sources: [{ source: 'NOAA / National Weather Service', retrievedAt, modelRunAt: updatedAt, resolution: 'approximately 2.5 km grid', coverage: 'United States', quality: ageMin > 180 ? 'stale' : 'good' }],
      status: missingSnowHours > 0 ? 'partial' : 'available',
      warnings: missingSnowHours > 0 ? ['NWS does not provide snowfall amounts for every forecast hour/grid location. Missing snow values are left unavailable rather than estimated.'] : [],
    };
  }

  async getAlerts(location: CanonicalLocation): Promise<Alert[]> {
    const { data } = await fetchJson<NwsAlerts>(`${NWS}/alerts/active?point=${location.latitude},${location.longitude}`, { headers: this.headers() });
    return (data.features ?? []).map((feature) => ({
      id: feature.id ?? crypto.randomUUID(),
      title: feature.properties.event ?? 'Weather alert',
      severity: feature.properties.severity ?? 'Unknown',
      area: feature.properties.areaDesc,
      source: feature.properties.senderName ?? 'NOAA / National Weather Service',
      issuedAt: feature.properties.sent,
      effectiveAt: feature.properties.effective,
      expiresAt: feature.properties.expires,
      description: feature.properties.description,
    }));
  }
}
