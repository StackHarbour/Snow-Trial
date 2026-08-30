import { describe, expect, it } from "vitest";
import { getForecastForLocation } from "@/services/forecast-service";
import { getLocationBySlug } from "@/services/location-service";

describe("demo forecast provider", () => {
  it("returns normalized forecast data with provider provenance", async () => { const location = await getLocationBySlug("denver-colorado"); if (!location) throw new Error("fixture missing"); const forecast = await getForecastForLocation(location); expect(forecast.provider.mode).toBe("demo"); expect(forecast.snow.snowfall?.unit).toBe("in"); });
  it("keeps weather available when snow data is unavailable", async () => { const location = await getLocationBySlug("frigid-pass-demo"); if (!location) throw new Error("fixture missing"); const forecast = await getForecastForLocation(location); expect(forecast.snow.availability).toBe("unavailable"); expect(forecast.weather.availability).toBe("available"); });
});
