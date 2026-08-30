import type { CanonicalLocation } from '@/domain/location/types';
import type { ForecastResult } from '@/domain/forecast/types';
import { NwsProvider } from '@/providers/nws';

interface CacheEntry { expiresAt: number; value: ForecastResult }
const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60_000;

export class ForecastOrchestrator {
  private readonly provider = new NwsProvider();

  async get(location: CanonicalLocation): Promise<ForecastResult> {
    const key = `${location.latitude.toFixed(4)}:${location.longitude.toFixed(4)}`;
    const existing = cache.get(key);
    if (existing && existing.expiresAt > Date.now()) return existing.value;
    const value = await this.provider.getForecast(location);
    cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
    return value;
  }
}
