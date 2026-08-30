import type { CanonicalLocation } from '@/domain/location/types';
import type { Alert, ForecastResult } from '@/domain/forecast/types';

export interface LocationSearchResult extends CanonicalLocation {
  score?: number;
}

export interface GeocodingProvider {
  search(query: string): Promise<LocationSearchResult[]>;
  reverse(latitude: number, longitude: number): Promise<LocationSearchResult | null>;
}

export interface ForecastProvider {
  getForecast(location: CanonicalLocation): Promise<ForecastResult>;
}

export interface AlertProvider {
  getAlerts(location: CanonicalLocation): Promise<Alert[]>;
}
