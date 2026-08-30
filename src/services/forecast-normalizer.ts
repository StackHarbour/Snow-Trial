import type { NormalizedSnowForecast } from "@/domain/forecast/types";
import type { CanonicalLocation } from "@/domain/location/types";

export interface DemoForecastSourceData {
  sourceUpdatedAt: string;
  retrievedAt: string;
  validPeriod: { start: string; end: string; label: string };
  snow: { availability: "available" | "partial" | "unavailable"; snowfallIn?: number; accumulationIn?: number; probabilityPercent?: number; timing?: string; intensity?: "light" | "moderate" | "heavy" | "unknown" };
  weather: { precipitationType: "snow" | "rain" | "mixed" | "none" | "unknown"; lowF: number; highF: number; windMph: number };
  freshness: "fresh" | "stale" | "unknown";
  confidence: NormalizedSnowForecast["confidence"];
}

const inches = (value: number) => ({ value, unit: "in" as const });
const fahrenheit = (value: number) => ({ value, unit: "F" as const });
const milesPerHour = (value: number) => ({ value, unit: "mph" as const });

export function normalizeDemoForecast(location: CanonicalLocation, raw: DemoForecastSourceData): NormalizedSnowForecast {
  return {
    location,
    generatedAt: raw.retrievedAt,
    validPeriod: raw.validPeriod,
    freshness: raw.freshness,
    confidence: raw.confidence,
    provider: { id: "demo-snow-trail", name: "Snow Trail demonstration provider", mode: "demo", sourceUpdatedAt: raw.sourceUpdatedAt, retrievedAt: raw.retrievedAt },
    snow: {
      availability: raw.snow.availability,
      ...(raw.snow.snowfallIn === undefined ? {} : { snowfall: inches(raw.snow.snowfallIn) }),
      ...(raw.snow.accumulationIn === undefined ? {} : { accumulation: inches(raw.snow.accumulationIn) }),
      ...(raw.snow.probabilityPercent === undefined ? {} : { probability: { value: raw.snow.probabilityPercent, unit: "percent" as const } }),
      ...(raw.snow.timing === undefined ? {} : { timing: raw.snow.timing }),
      ...(raw.snow.intensity === undefined ? {} : { intensity: raw.snow.intensity }),
    },
    weather: { availability: "available", precipitationType: raw.weather.precipitationType, temperature: { low: fahrenheit(raw.weather.lowF), high: fahrenheit(raw.weather.highF) }, wind: milesPerHour(raw.weather.windMph) },
  };
}
