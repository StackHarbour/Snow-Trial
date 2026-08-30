import type { ForecastResult, HourlyForecast, PrecipitationType } from '@/domain/forecast/types';
import type { CanonicalLocation } from '@/domain/location/types';
import { evaluateConfidence } from '@/domain/forecast/calculations';
import { fetchJson, env } from '@/lib/http';
import type { ForecastProvider } from './types';

const BASE = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  generationtime_ms?: number;
  timezone?: string;
  timezone_abbreviation?: string;
  utc_offset_seconds?: number;
  hourly?: {
    time: string[];
    temperature_2m?: number[];
    snowfall?: number[];
    precipitation_probability?: number[];
    precipitation?: number[];
    wind_speed_10m?: number[];
    wind_gusts_10m?: number[];
    weather_code?: number[];
  };
  current?: {
    time?: string;
    temperature_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
}

function weatherCodeToCondition(code?: number): string {
  if (code === undefined) return 'Condition unavailable';
  if (code === 0) return 'Clear sky';
  if ([1, 2, 3].includes(code)) return code === 1 ? 'Mainly clear' : code === 2 ? 'Partly cloudy' : 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([85, 86].includes(code)) return 'Snow showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Mixed precipitation';
}

function weatherCodeToPrecipitationType(code?: number): PrecipitationType {
  if (code === undefined) return 'unknown';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([51, 53, 55, 56, 57].includes(code)) return 'rain';
  if ([95, 96, 99].includes(code)) return 'mixed';
  return 'unknown';
}

export class OpenMeteoForecastProvider implements ForecastProvider {
  async getForecast(location: CanonicalLocation): Promise<ForecastResult> {
    const retrievedAt = new Date().toISOString();
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      hourly: 'temperature_2m,snowfall,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,weather_code',
      current: 'temperature_2m,wind_speed_10m,weather_code',
      forecast_days: '7',
      timezone: 'auto',
    });
    const key = env('OPEN_METEO_API_KEY');
    if (key) params.set('apikey', key);

    const { data } = await fetchJson<OpenMeteoResponse>(`${BASE}?${params.toString()}`);
    const hourly = data.hourly;
    if (!hourly?.time?.length) throw new Error('Open-Meteo returned no hourly forecast data.');

    const periods = hourly.time.slice(0, 168);
    const forecastHours: HourlyForecast[] = periods.map((time, index) => {
      const snowCm = hourly.snowfall?.[index];
      const snowIn = snowCm === undefined ? undefined : snowCm / 2.54;
      return {
        time,
        temperatureF: hourly.temperature_2m?.[index] === undefined ? undefined : hourly.temperature_2m[index] * 9 / 5 + 32,
        snowfallIn: snowIn,
        snowfallRateInPerHour: snowIn,
        precipitationProbability: hourly.precipitation_probability?.[index],
        precipitationType: weatherCodeToPrecipitationType(hourly.weather_code?.[index]),
        windMph: hourly.wind_speed_10m?.[index] === undefined ? undefined : hourly.wind_speed_10m[index] * 0.621371,
        windGustMph: hourly.wind_gusts_10m?.[index] === undefined ? undefined : hourly.wind_gusts_10m[index] * 0.621371,
        condition: weatherCodeToCondition(hourly.weather_code?.[index]),
      };
    });

    const next24 = forecastHours.slice(0, 24).reduce((s, h) => s + (h.snowfallIn ?? 0), 0);
    const next3d = forecastHours.slice(0, 72).reduce((s, h) => s + (h.snowfallIn ?? 0), 0);
    const next7d = forecastHours.reduce((s, h) => s + (h.snowfallIn ?? 0), 0);
    const snowHours = forecastHours.filter((h) => h.precipitationType === 'snow' || h.precipitationType === 'mixed');
    const snowfallProbability = snowHours.length ? Math.max(...snowHours.map((h) => h.precipitationProbability ?? 0)) : undefined;
    const missingSnowHours = forecastHours.filter((h) => h.snowfallIn === undefined).length;
    const confidence = evaluateConfidence({
      horizonHours: forecastHours.length,
      sourceCount: 1,
      dataFreshnessMinutes: 0,
      missingSnowHours,
    });

    return {
      location,
      current: {
        temperatureF: data.current?.temperature_2m === undefined ? undefined : data.current.temperature_2m * 9 / 5 + 32,
        condition: weatherCodeToCondition(data.current?.weather_code),
        windMph: data.current?.wind_speed_10m === undefined ? undefined : data.current.wind_speed_10m * 0.621371,
        observationTime: data.current?.time,
      },
      hourly: forecastHours,
      snow: {
        next6hIn: forecastHours.slice(0, 6).reduce((s, h) => s + (h.snowfallIn ?? 0), 0),
        next12hIn: forecastHours.slice(0, 12).reduce((s, h) => s + (h.snowfallIn ?? 0), 0),
        next24hIn: next24,
        next3dIn: next3d,
        next7dIn: next7d,
        snowfallProbability,
        precipitationProbability: Math.max(...forecastHours.slice(0, 24).map((h) => h.precipitationProbability ?? 0)),
      },
      confidence,
      freshness: { retrievedAt, isStale: false },
      sources: [{
        source: 'Open-Meteo',
        retrievedAt,
        resolution: 'model-dependent',
        coverage: 'Global',
        quality: 'good',
      }],
      status: missingSnowHours > 0 ? 'partial' : 'available',
      warnings: missingSnowHours > 0 ? ['Open-Meteo did not return snowfall for every forecast hour. Missing snow values are left unavailable rather than estimated.'] : [],
    };
  }
}
