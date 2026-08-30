export type PrecipitationType = 'snow' | 'rain' | 'sleet' | 'freezing-rain' | 'mixed' | 'none';
export type ForecastStatus = 'available' | 'loading' | 'stale' | 'unavailable' | 'partial' | 'unsupported' | 'invalid';

export type Location = {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  postalCodes: string[];
  latitude: number;
  longitude: number;
  elevationFt: number;
  type: 'city' | 'mountain' | 'resort' | 'locality';
};

export type Forecast = {
  location: Location;
  status: ForecastStatus;
  source: string;
  sourceUpdatedAt: string;
  retrievedAt: string;
  validUntil: string;
  snowfall24hIn: number;
  snowfallRangeIn: [number, number];
  snowProbability: number;
  temperatureF: number;
  precipitationType: PrecipitationType;
  confidence: 'high' | 'moderate' | 'low';
  confidenceReason: string;
  hourly: { label: string; snowIn: number; probability: number; tempF: number }[];
  alerts: { severity: 'watch' | 'advisory' | 'warning'; title: string; detail: string }[];
};

const locations: Location[] = [
  { id: 'breckenridge-co', slug: 'breckenridge-co', name: 'Breckenridge', region: 'Colorado', country: 'United States', postalCodes: ['80424'], latitude: 39.4817, longitude: -106.0384, elevationFt: 9600, type: 'resort' },
  { id: 'park-city-ut', slug: 'park-city-ut', name: 'Park City', region: 'Utah', country: 'United States', postalCodes: ['84060'], latitude: 40.6461, longitude: -111.498, elevationFt: 7000, type: 'resort' },
  { id: 'mammoth-lakes-ca', slug: 'mammoth-lakes-ca', name: 'Mammoth Lakes', region: 'California', country: 'United States', postalCodes: ['93546'], latitude: 37.6485, longitude: -118.9721, elevationFt: 7880, type: 'resort' },
  { id: 'springfield-il', slug: 'springfield-il', name: 'Springfield', region: 'Illinois', country: 'United States', postalCodes: ['62701'], latitude: 39.7817, longitude: -89.6501, elevationFt: 558, type: 'city' },
  { id: 'springfield-mo', slug: 'springfield-mo', name: 'Springfield', region: 'Missouri', country: 'United States', postalCodes: ['65801'], latitude: 37.209, longitude: -93.2923, elevationFt: 1269, type: 'city' },
  { id: 'springfield-ma', slug: 'springfield-ma', name: 'Springfield', region: 'Massachusetts', country: 'United States', postalCodes: ['01101'], latitude: 42.1015, longitude: -72.5898, elevationFt: 82, type: 'city' },
];

export function getLocations(query = ''): Location[] {
  const q = query.trim().toLowerCase();
  if (!q) return locations;
  return locations.filter((location) =>
    [location.name, location.region, location.country, location.slug, ...location.postalCodes]
      .some((value) => value.toLowerCase().includes(q)),
  );
}

export function resolveLocation(query: string): { kind: 'resolved' | 'ambiguous' | 'not-found' | 'invalid'; locations: Location[] } {
  const trimmed = query.trim();
  if (!trimmed) return { kind: 'invalid', locations: [] };
  if (/^\d{5}$/.test(trimmed)) {
    const matches = locations.filter((location) => location.postalCodes.includes(trimmed));
    return matches.length ? { kind: 'resolved', locations: matches } : { kind: 'not-found', locations: [] };
  }
  if (/^\d+$/.test(trimmed)) return { kind: 'invalid', locations: [] };
  const matches = getLocations(trimmed);
  if (!matches.length) return { kind: 'not-found', locations: [] };
  if (matches.length === 1) return { kind: 'resolved', locations: matches };
  return { kind: 'ambiguous', locations: matches };
}

export function getDemoForecast(location: Location): Forecast {
  const resort = location.type !== 'city';
  const base = resort ? 7 : 0.8;
  const hourly = ['Now', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM', '2 AM'].map((label, index) => ({
    label,
    snowIn: Number(Math.max(0, base * [0.05, 0.08, 0.18, 0.28, 0.2, 0.12, 0.06, 0.03][index]).toFixed(1)),
    probability: Math.min(96, Math.round((resort ? 62 : 28) + index * (resort ? 4 : 2))),
    tempF: Math.round((resort ? 29 : 34) - index * 0.6),
  }));
  return {
    location,
    status: 'available',
    source: 'Snow Trail demo provider',
    sourceUpdatedAt: '2026-08-30T14:15:00-06:00',
    retrievedAt: '2026-08-30T14:33:00-06:00',
    validUntil: '2026-08-31T14:00:00-06:00',
    snowfall24hIn: base,
    snowfallRangeIn: [Math.max(0, Number((base * 0.8).toFixed(1))), Number((base * 1.25).toFixed(1))],
    snowProbability: resort ? 82 : 34,
    temperatureF: resort ? 29 : 34,
    precipitationType: resort ? 'snow' : 'mixed',
    confidence: resort ? 'high' : 'moderate',
    confidenceReason: resort ? 'Good source agreement and recent mountain-grid coverage.' : 'Lower snow signal and lower-elevation precipitation uncertainty.',
    hourly,
    alerts: resort ? [{ severity: 'advisory', title: 'Winter weather advisory', detail: 'Periods of snow may reduce visibility and travel conditions tonight.' }] : [],
  };
}

export function inchesToCm(inches: number) { return Number((inches * 2.54).toFixed(1)); }
