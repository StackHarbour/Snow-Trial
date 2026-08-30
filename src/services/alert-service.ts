import type { CanonicalLocation } from '@/domain/location/types';
import type { Alert } from '@/domain/forecast/types';
import { NwsProvider } from '@/providers/nws';

export class AlertService {
  private readonly provider = new NwsProvider();
  async get(location: CanonicalLocation): Promise<Alert[]> {
    if (location.countryCode !== 'US') return [];
    return this.provider.getAlerts(location);
  }
}
