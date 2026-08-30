export type LocationType = 'city' | 'locality' | 'mountain' | 'resort' | 'zip' | 'coordinate';

export interface CanonicalLocation {
  id: string;
  name: string;
  admin1?: string;
  admin2?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  elevationM?: number;
  timezone: string;
  type: LocationType;
  source: string;
  sourceId?: string;
  postalCodes?: string[];
}
