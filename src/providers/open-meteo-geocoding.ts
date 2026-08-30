import type { GeocodingProvider, LocationSearchResult } from './types';
import { fetchJson, env } from '@/lib/http';

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  postcodes?: string[];
}

interface OpenMeteoResponse { results?: OpenMeteoResult[] }

function featureToType(feature?: string): LocationSearchResult['type'] {
  if (feature === 'MT') return 'mountain';
  if (feature === 'SKI') return 'resort';
  if (feature?.startsWith('PPL')) return 'city';
  return 'locality';
}

export class OpenMeteoGeocodingProvider implements GeocodingProvider {
  private base = 'https://geocoding-api.open-meteo.com/v1/search';

  async search(query: string): Promise<LocationSearchResult[]> {
    const params = new URLSearchParams({ name: query.trim(), count: '8', language: 'en', format: 'json', countryCode: 'US' });
    const key = env('OPEN_METEO_API_KEY');
    if (key) params.set('apikey', key);
    const { data } = await fetchJson<OpenMeteoResponse>(`${this.base}?${params.toString()}`);
    return (data.results ?? []).map((item) => ({
      id: `geonames:${item.id}`,
      name: item.name,
      admin1: item.admin1,
      admin2: item.admin2,
      country: item.country ?? 'United States',
      countryCode: item.country_code ?? 'US',
      latitude: item.latitude,
      longitude: item.longitude,
      elevationM: item.elevation,
      timezone: item.timezone ?? 'America/Denver',
      type: /^\d{5}(-\d{4})?$/.test(query.trim()) ? 'zip' : featureToType(item.feature_code),
      source: 'Open-Meteo Geocoding / GeoNames',
      sourceId: String(item.id),
      postalCodes: item.postcodes,
    }));
  }

  async reverse(_latitude: number, _longitude: number): Promise<LocationSearchResult | null> {
    // Open-Meteo's current geocoding documentation exposes search/get, not reverse geocoding.
    // Reverse lookup is therefore delegated to the U.S. Census geocoder.
    return null;
  }
}
