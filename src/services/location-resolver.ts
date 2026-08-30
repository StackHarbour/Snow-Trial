import { OpenMeteoGeocodingProvider } from '@/providers/open-meteo-geocoding';
import { CensusReverseGeocodingProvider } from '@/providers/census-reverse';
import { fetchJson } from '@/lib/http';
import type { GeocodingProvider, LocationSearchResult } from '@/providers/types';

export class LocationResolver {
  private readonly reverseProvider = new CensusReverseGeocodingProvider();
  constructor(private readonly provider: GeocodingProvider = new OpenMeteoGeocodingProvider()) {}

  async search(query: string): Promise<LocationSearchResult[]> {
    const normalized = query.trim();
    if (normalized.length < 2) return [];
    return this.provider.search(normalized);
  }

  async reverse(latitude: number, longitude: number): Promise<LocationSearchResult | null> {
    const census = await this.reverseProvider.reverse(latitude, longitude);
    if (census) {
      try {
        const point = await fetchJson<{ properties?: { timeZone?: string } }>(`https://api.weather.gov/points/${latitude},${longitude}`, { headers: { 'User-Agent': process.env.NWS_USER_AGENT ?? 'Snow Trail/0.1 (contact@example.com)' } });
        if (point.data.properties?.timeZone) census.timezone = point.data.properties.timeZone;
      } catch { /* timezone is supplemental metadata; forecast resolution still works */ }
      return census;
    }
    return this.provider.reverse(latitude, longitude);
  }
}
