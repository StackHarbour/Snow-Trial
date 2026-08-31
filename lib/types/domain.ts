export type LocationType = 'Ski Resort' | 'Mountain' | 'City' | 'Locality';
export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

export interface SnowLocation {
  id: string;
  name: string;
  region: string;
  type: LocationType;
  elevation?: number; // in feet
  coordinates: { lat: number; lng: number };
}

export interface HourlyForecast {
  timestamp: string; // ISO string or display string for Phase 1
  temperature: number;
  snowfallInches: number;
  snowProbability: number;
  precipType: 'Snow' | 'Rain' | 'Mixed' | 'None';
}

export interface SnowForecast {
  locationId: string;
  summary: string;
  totalSnowfallRange: string;
  maxProbability: number;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  freshness: {
    updatedAt: string;
    isStale: boolean;
  };
  hourly: HourlyForecast[];
}

export interface WeatherAlert {
  id: string;
  locationId: string;
  severity: 'Advisory' | 'Watch' | 'Warning' | 'Severe';
  title: string;
  affectedArea: string;
  issueTime: string;
  expirationTime: string;
}

export interface IForecastProvider {
  searchLocations(query: string): Promise<SnowLocation[]>;
  getLocation(id: string): Promise<SnowLocation | null>;
  getForecast(locationId: string): Promise<SnowForecast | null>;
  getAlerts(locationId: string): Promise<WeatherAlert[]>;
}