import type { Location } from '@/domain/location/model';
import type { Forecast, HourlyForecast } from '@/domain/forecast/model';
import { evaluateConfidence } from '@/domain/confidence/evaluate';

export interface ForecastProvider {
  getForecast(location: Location): Promise<Forecast>;
}

export class DemoForecastProvider implements ForecastProvider {
  async getForecast(location: Location): Promise<Forecast> {
    const generatedAt = new Date().toISOString();

    const hourly: HourlyForecast[] = Array.from({ length: 48 }, (_, i) => {
      const t = new Date(Date.now() + i * 3600000);
      const active = i >= 9 && i <= 21;
      const snow = active
        ? Number((0.18 + 0.08 * Math.sin(i)).toFixed(2))
        : 0;

      return {
        time: t.toISOString(),
        snowfallIn: snow,
        accumulationIn: Number((snow * (i + 1)).toFixed(1)),
        snowProbability: active
          ? Math.min(95, 55 + (i % 5) * 7)
          : 12,
        temperatureF: 30 - Math.round(4 * Math.sin(i / 6)),
        precipitationType: active ? 'snow' : 'none',
      };
    });

    const total = Number(
      hourly.reduce((s, h) => s + h.snowfallIn, 0).toFixed(1)
    );

    const source = {
      provider: 'Snow Trail Demo Provider',
      model: 'Deterministic development model',
      retrievedAt: generatedAt,
      validAt: generatedAt,
      gridResolutionKm: 13,
      quality: 'good' as const,
    };

    return {
      locationId: location.id,
      generatedAt,
      timezone: 'America/Denver',

      current: {
        snowfallRateIn: hourly[0].snowfallIn,
        temperatureF: hourly[0].temperatureF,
        precipitationType: hourly[0].precipitationType,
      },

      hourly,

      totalSnowfallIn: total,

      nextSnowEvent: {
        start: hourly[9].time,
        end: hourly[21].time,
        totalIn: Number(
          hourly
            .slice(9, 22)
            .reduce((s, h) => s + h.snowfallIn, 0)
            .toFixed(1)
        ),
      },

      confidence: evaluateConfidence({
        source,
        horizonHours: 48,
        precipitationType: 'snow',
      }),

      freshness: {
        status: 'fresh',
        ageMinutes: 0,
        label: 'Updated just now',
      },

      source,

      warnings: [
        'DEMO DATA — this forecast is synthetic and is not live weather.',
      ],
    };
  }
}