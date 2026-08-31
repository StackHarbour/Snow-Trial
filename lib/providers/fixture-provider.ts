import { IForecastProvider, SnowLocation, SnowForecast, WeatherAlert } from '../types/domain';

// FIXTURE DATA ISOLATION
const FIXTURE_LOCATIONS: SnowLocation[] = [
  { id: 'aspen-co', name: 'Aspen Snowmass', region: 'Colorado, USA', type: 'Ski Resort', elevation: 12510, coordinates: { lat: 39.1911, lng: -106.8175 } },
  { id: 'springfield-il', name: 'Springfield', region: 'Illinois, USA', type: 'City', elevation: 597, coordinates: { lat: 39.7817, lng: -89.6501 } },
  { id: 'springfield-ma', name: 'Springfield', region: 'Massachusetts, USA', type: 'City', elevation: 69, coordinates: { lat: 42.1015, lng: -72.5898 } },
  { id: 'mt-baker-wa', name: 'Mt. Baker', region: 'Washington, USA', type: 'Ski Resort', elevation: 5089, coordinates: { lat: 48.8618, lng: -121.6603 } },
];

const FIXTURE_FORECASTS: Record<string, SnowForecast> = {
  'aspen-co': {
    locationId: 'aspen-co',
    summary: 'Heavy Alpine Snow Expected',
    totalSnowfallRange: '12–18"',
    maxProbability: 95,
    confidence: 'High',
    confidenceReason: 'All 4 major global models maintain exact trajectory and moisture density agreement over the next 48 hours.',
    freshness: { updatedAt: '12 minutes ago', isStale: false },
    hourly: [
      { timestamp: 'Now', temperature: 18, snowfallInches: 0.5, snowProbability: 80, precipType: 'Snow' },
      { timestamp: '2 PM', temperature: 16, snowfallInches: 1.2, snowProbability: 90, precipType: 'Snow' },
      { timestamp: '3 PM', temperature: 14, snowfallInches: 2.0, snowProbability: 95, precipType: 'Snow' },
      { timestamp: '4 PM', temperature: 13, snowfallInches: 2.5, snowProbability: 95, precipType: 'Snow' },
      { timestamp: '5 PM', temperature: 12, snowfallInches: 1.5, snowProbability: 85, precipType: 'Snow' },
      { timestamp: '6 PM', temperature: 10, snowfallInches: 1.0, snowProbability: 75, precipType: 'Snow' },
    ]
  },
  'mt-baker-wa': {
    locationId: 'mt-baker-wa',
    summary: 'Mixed Precipitation Transitioning to Snow',
    totalSnowfallRange: '4–8"',
    maxProbability: 60,
    confidence: 'Moderate',
    confidenceReason: 'The freezing line is fluctuating between 4,500ft and 5,200ft, which may drastically alter total accumulation.',
    freshness: { updatedAt: '45 minutes ago', isStale: false },
    hourly: [
      { timestamp: 'Now', temperature: 34, snowfallInches: 0, snowProbability: 20, precipType: 'Mixed' },
      { timestamp: '2 PM', temperature: 32, snowfallInches: 0.5, snowProbability: 60, precipType: 'Snow' },
      { timestamp: '3 PM', temperature: 30, snowfallInches: 1.5, snowProbability: 80, precipType: 'Snow' },
      { timestamp: '4 PM', temperature: 29, snowfallInches: 1.5, snowProbability: 85, precipType: 'Snow' },
    ]
  }
};

const FIXTURE_ALERTS: Record<string, WeatherAlert[]> = {
  'aspen-co': [
    { id: 'al-1', locationId: 'aspen-co', severity: 'Warning', title: 'Winter Storm Warning', affectedArea: 'Pitkin County', issueTime: '2 hours ago', expirationTime: 'Tomorrow at 11:00 AM MST' }
  ]
};

export class FixtureProvider implements IForecastProvider {
  async searchLocations(query: string): Promise<SnowLocation[]> {
    const q = query.toLowerCase();
    if (!q) return [];
    return FIXTURE_LOCATIONS.filter(loc => loc.name.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q));
  }
  
  async getLocation(id: string): Promise<SnowLocation | null> {
    return FIXTURE_LOCATIONS.find(loc => loc.id === id) || null;
  }

  async getForecast(locationId: string): Promise<SnowForecast | null> {
    return FIXTURE_FORECASTS[locationId] || {
      locationId,
      summary: 'No Snowfall Expected',
      totalSnowfallRange: '0"',
      maxProbability: 0,
      confidence: 'High',
      confidenceReason: 'High pressure system dominating the region. No moisture anticipated.',
      freshness: { updatedAt: '1 hour ago', isStale: false },
      hourly: [
        { timestamp: 'Now', temperature: 45, snowfallInches: 0, snowProbability: 0, precipType: 'None' },
        { timestamp: '2 PM', temperature: 48, snowfallInches: 0, snowProbability: 0, precipType: 'None' },
        { timestamp: '3 PM', temperature: 47, snowfallInches: 0, snowProbability: 0, precipType: 'None' },
      ]
    };
  }

  async getAlerts(locationId: string): Promise<WeatherAlert[]> {
    return FIXTURE_ALERTS[locationId] || [];
  }
}

// Singleton export for UI consumption
export const ForecastService = new FixtureProvider();