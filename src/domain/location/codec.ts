import type { CanonicalLocation } from './types';

export function encodeLocation(location: CanonicalLocation): string {
  const json = JSON.stringify(location);
  return Buffer.from(json, 'utf8').toString('base64url');
}

export function decodeLocation(id: string): CanonicalLocation | null {
  try {
    const value = JSON.parse(Buffer.from(id, 'base64url').toString('utf8')) as CanonicalLocation;
    if (!value || typeof value.latitude !== 'number' || typeof value.longitude !== 'number' || !value.name) return null;
    return value;
  } catch {
    return null;
  }
}
