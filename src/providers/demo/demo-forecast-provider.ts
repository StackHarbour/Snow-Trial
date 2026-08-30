import type { ForecastProvider } from "@/providers/contracts";
import type { CanonicalLocation } from "@/domain/location/types";
import { normalizeDemoForecast, type DemoForecastSourceData } from "@/services/forecast-normalizer";

export class DemoForecastProvider implements ForecastProvider {
  async getForecast(location: CanonicalLocation) {
    const unavailable = location.slug === "frigid-pass-demo";
    const stale = location.slug === "lake-tahoe-california";
    const snow = unavailable
      ? { availability: "unavailable" as const }
      : stale
        ? { availability: "partial" as const, snowfallIn: 3, accumulationIn: 3, probabilityPercent: 55, timing: "Intermittent overnight", intensity: "light" as const }
        : { availability: "available" as const, snowfallIn: 7, accumulationIn: 7, probabilityPercent: 78, timing: "Begins after 6 PM; heaviest overnight", intensity: "moderate" as const };
    const raw: DemoForecastSourceData = {
      sourceUpdatedAt: "2026-08-30T05:30:00.000Z", retrievedAt: "2026-08-30T06:00:00.000Z", validPeriod: { start: "2026-08-30T18:00:00.000Z", end: "2026-08-31T18:00:00.000Z", label: "Next 24 hours" },
      freshness: stale ? "stale" : "fresh",
      confidence: stale ? { level: "low", explanation: "Demo scenario: this forecast is intentionally marked stale and low confidence." } : { level: "moderate", explanation: "Demo scenario: qualitative confidence only; no scientific certainty is implied." },
      snow,
      weather: { precipitationType: unavailable ? "mixed" : "snow", lowF: 19, highF: 31, windMph: 14 },
    };
    return normalizeDemoForecast(location, raw);
  }
}
