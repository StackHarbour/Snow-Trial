import type { ConfidenceLevel, HourlyForecast } from './types';

export function sumSnow(hours: HourlyForecast[], start: number, end: number): number {
  return hours.slice(start, end).reduce((sum, hour) => sum + (hour.snowfallIn ?? 0), 0);
}

export function deriveSnowProbability(hours: HourlyForecast[]): number | undefined {
  const snowHours = hours.filter((hour) => hour.precipitationType === 'snow' || hour.precipitationType === 'mixed');
  if (!snowHours.length) return undefined;
  return Math.round(Math.max(...snowHours.map((h) => h.precipitationProbability ?? 0)));
}

export function evaluateConfidence(input: {
  horizonHours: number;
  sourceCount: number;
  dataFreshnessMinutes: number;
  missingSnowHours: number;
  sourceDisagreement?: boolean;
}): { level: ConfidenceLevel; explanation: string } {
  let score = 100;
  if (input.horizonHours > 120) score -= 30;
  else if (input.horizonHours > 72) score -= 18;
  else if (input.horizonHours > 36) score -= 8;
  if (input.sourceCount < 1) score -= 35;
  if (input.dataFreshnessMinutes > 120) score -= 30;
  else if (input.dataFreshnessMinutes > 60) score -= 12;
  score -= Math.min(25, input.missingSnowHours * 2);
  if (input.sourceDisagreement) score -= 20;

  if (score >= 72) return { level: 'High', explanation: 'Near-term forecast data is fresh and internally consistent.' };
  if (score >= 48) return { level: 'Moderate', explanation: input.sourceDisagreement ? 'Forecast sources currently disagree on key snowfall inputs.' : 'Confidence is reduced by forecast horizon or incomplete snow-specific data.' };
  return { level: 'Low', explanation: 'Forecast uncertainty or data limitations are currently significant.' };
}

export function inchesFromNwsUnit(value: number, unit: string): number {
  if (unit.includes('in')) return value;
  if (unit.includes('m')) return value * 39.3700787;
  if (unit.includes('cm')) return value / 2.54;
  return value;
}
