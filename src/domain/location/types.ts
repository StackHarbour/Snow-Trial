export type LocationType = "city" | "resort" | "mountain" | "region" | "other";

export interface CanonicalLocation {
  id: string;
  slug: string;
  name: string;
  locality: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  elevation?: { value: number; unit: "m" };
  type: LocationType;
}

export type LocationSearchResult =
  | { kind: "resolved"; location: CanonicalLocation }
  | { kind: "ambiguous"; query: string; candidates: CanonicalLocation[] }
  | { kind: "no-result"; query: string }
  | { kind: "invalid-zip"; query: string }
  | { kind: "unsupported"; query: string; location?: CanonicalLocation };
