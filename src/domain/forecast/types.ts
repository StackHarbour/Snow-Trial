import type { CanonicalLocation } from "@/domain/location/types";

export type FreshnessState = "fresh" | "stale" | "unknown";
export type ConfidenceLevel = "high" | "moderate" | "low" | "unknown";
export type Availability = "available" | "partial" | "unavailable";
export type PrecipitationType = "snow" | "rain" | "mixed" | "none" | "unknown";

export interface Quantity<Unit extends string> { value: number; unit: Unit }
export interface ForecastPeriod { start: string; end: string; label: string }
export interface ProviderMetadata { id: string; name: string; mode: "demo" | "production"; sourceUpdatedAt: string; retrievedAt: string }

export interface NormalizedSnowForecast {
  location: CanonicalLocation;
  generatedAt: string;
  validPeriod: ForecastPeriod;
  snow: {
    availability: Availability;
    snowfall?: Quantity<"in">;
    accumulation?: Quantity<"in">;
    probability?: Quantity<"percent">;
    timing?: string;
    intensity?: "light" | "moderate" | "heavy" | "unknown";
  };
  weather: {
    availability: Availability;
    precipitationType: PrecipitationType;
    temperature?: { low: Quantity<"F">; high: Quantity<"F"> };
    wind?: Quantity<"mph">;
  };
  confidence: { level: ConfidenceLevel; explanation: string };
  freshness: FreshnessState;
  provider: ProviderMetadata;
}
