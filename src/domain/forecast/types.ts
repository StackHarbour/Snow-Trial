import type { CanonicalLocation } from '@/domain/location/types';

export type DataStatus = 'available' | 'loading' | 'stale' | 'unavailable' | 'partial' | 'unsupported' | 'invalid';
export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';
export type PrecipitationType = 'snow' | 'rain' | 'sleet' | 'freezing-rain' | 'mixed' | 'unknown';

export interface SourceMetadata {
  source: string;
  retrievedAt: string;
  modelRunAt?: string;
  validFrom?: string;
  validTo?: string;
  resolution?: string;
  units?: string;
  coverage?: string;
  quality: 'good' | 'degraded' | 'stale' | 'unavailable';
}

export interface HourlyForecast {
  time: string;
  temperatureF?: number;
  snowfallIn?: number;
  snowfallRateInPerHour?: number;
  precipitationProbability?: number;
  precipitationType: PrecipitationType;
  windMph?: number;
  windGustMph?: number;
  snowLevelFt?: number;
  condition: string;
}

export interface SnowSummary {
  next6hIn?: number;
  next12hIn?: number;
  next24hIn?: number;
  next3dIn?: number;
  next7dIn?: number;
  snowfallProbability?: number;
  precipitationProbability?: number;
}

export interface Alert {
  id: string;
  title: string;
  severity: string;
  area?: string;
  source: string;
  issuedAt?: string;
  effectiveAt?: string;
  expiresAt?: string;
  description?: string;
}

export interface ForecastResult {
  location: CanonicalLocation;
  current: {
    temperatureF?: number;
    condition: string;
    windMph?: number;
    observationTime?: string;
  };
  hourly: HourlyForecast[];
  snow: SnowSummary;
  confidence: { level: ConfidenceLevel; explanation: string };
  freshness: {
    retrievedAt: string;
    providerUpdatedAt?: string;
    isStale: boolean;
  };
  sources: SourceMetadata[];
  status: DataStatus;
  warnings: string[];
}
