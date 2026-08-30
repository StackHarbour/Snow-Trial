import test from 'node:test';
import assert from 'node:assert/strict';
import { sumSnow, deriveSnowProbability, evaluateConfidence } from '../../src/domain/forecast/calculations.ts';

test('snow accumulation windows sum real hourly values without fabrication', () => {
  const hours = [1, 2, 0, 0.5].map((snowfallIn, i) => ({ time: new Date(Date.UTC(2026, 0, 1, i)).toISOString(), snowfallIn, precipitationType: 'snow', condition: 'Snow' }));
  assert.equal(sumSnow(hours, 0, 3), 3);
});

test('snow probability only considers snow/mixed precipitation hours', () => {
  const hours = [
    { time: '2026-01-01T00:00:00Z', precipitationProbability: 90, precipitationType: 'rain', condition: 'Rain' },
    { time: '2026-01-01T01:00:00Z', precipitationProbability: 72, precipitationType: 'snow', condition: 'Snow' },
    { time: '2026-01-01T02:00:00Z', precipitationProbability: 84, precipitationType: 'mixed', condition: 'Rain and snow' },
  ];
  assert.equal(deriveSnowProbability(hours), 84);
});

test('confidence is qualitative and degrades with stale/incomplete data', () => {
  assert.equal(evaluateConfidence({ horizonHours: 12, sourceCount: 1, dataFreshnessMinutes: 10, missingSnowHours: 0 }).level, 'High');
  assert.equal(evaluateConfidence({ horizonHours: 168, sourceCount: 1, dataFreshnessMinutes: 180, missingSnowHours: 12 }).level, 'Low');
});
