import type { NormalizedSnowForecast } from "@/domain/forecast/types";
import type { CanonicalLocation, LocationSearchResult } from "@/domain/location/types";

export interface LocationProvider { search(query: string): Promise<LocationSearchResult>; getBySlug(slug: string): Promise<CanonicalLocation | null> }
export interface ForecastProvider { getForecast(location: CanonicalLocation): Promise<NormalizedSnowForecast> }
