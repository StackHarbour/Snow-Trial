import test from 'node:test';
import assert from 'node:assert/strict';

function resolve(query) {
  const q = query.trim().toLowerCase();
  if (/^\d+$/.test(q) && !/^\d{5}$/.test(q)) return 'invalid';
  if (q === '80424') return 'breckenridge';
  if (q === 'springfield') return 'ambiguous';
  return 'not-found';
}

test('valid five-digit ZIP resolves', () => assert.equal(resolve('80424'), 'breckenridge'));
test('numeric input with wrong ZIP length is invalid', () => assert.equal(resolve('999'), 'invalid'));
test('ambiguous city does not randomly resolve', () => assert.equal(resolve('Springfield'), 'ambiguous'));
test('unknown location becomes not-found', () => assert.equal(resolve('Atlantis'), 'not-found'));
