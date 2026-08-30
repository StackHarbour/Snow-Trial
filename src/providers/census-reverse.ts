import type { CanonicalLocation } from '@/domain/location/types';
import type { GeocodingProvider, LocationSearchResult } from './types';
import { fetchJson } from '@/lib/http';

interface CensusGeographiesResponse {
  result?: {
    geographies?: {
      States?: Array<{ NAME?: string; GEOID?: string }>;
      'Incorporated Places'?: Array<{ NAME?: string; GEOID?: string }>;
      Counties?: Array<{ NAME?: string; GEOID?: string }>;
    };
  };
}

export class CensusReverseGeocodingProvider implements GeocodingProvider {
  async search(): Promise<LocationSearchResult[]> { return []; }

  async reverse(latitude: number, longitude: number): Promise<LocationSearchResult | null> {
    const params = new URLSearchParams({ benchmark: '4', vintage: '4', x: String(longitude), y: String(latitude), format: 'json' });
    const { data } = await fetchJson<CensusGeographiesResponse>(`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?${params.toString()}`);
    const geo = data.result?.geographies;
    const place = geo?.['Incorporated Places']?.[0];
    const state = geo?.States?.[0];
    const county = geo?.Counties?.[0];
    if (!place && !state) return null;
    const name = (place?.NAME ?? county?.NAME ?? state?.NAME ?? 'Current location').replace(/ (city|town|village|borough)$/i, '');
    const result: CanonicalLocation = {
      id: `census:${place?.GEOID ?? county?.GEOID ?? state?.GEOID ?? `${latitude.toFixed(4)}:${longitude.toFixed(4)}`}`,
      name,
      admin1: state?.NAME,
      admin2: county?.NAME,
      country: 'United States',
      countryCode: 'US',
      latitude,
      longitude,
      timezone: 'America/Denver',
      type: place ? 'city' : 'locality',
      source: 'U.S. Census Geocoder',
      sourceId: place?.GEOID ?? county?.GEOID ?? state?.GEOID,
    };
    return result;
  }
}
