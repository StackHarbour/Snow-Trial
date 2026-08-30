import type { CanonicalLocation } from "@/domain/location/types";

export const demoLocations: CanonicalLocation[] = [
  { id: "us-co-denver", slug: "denver-colorado", name: "Denver", locality: "Denver", region: "Colorado", country: "United States", latitude: 39.7392, longitude: -104.9903, timezone: "America/Denver", elevation: { value: 1609, unit: "m" }, type: "city" },
  { id: "us-co-breckenridge", slug: "breckenridge-colorado", name: "Breckenridge", locality: "Breckenridge", region: "Colorado", country: "United States", latitude: 39.4817, longitude: -106.0384, timezone: "America/Denver", elevation: { value: 2926, unit: "m" }, type: "resort" },
  { id: "us-ca-lake-tahoe", slug: "lake-tahoe-california", name: "Lake Tahoe", locality: "Lake Tahoe", region: "California", country: "United States", latitude: 39.0968, longitude: -120.0324, timezone: "America/Los_Angeles", elevation: { value: 1897, unit: "m" }, type: "region" },
  { id: "us-il-springfield", slug: "springfield-illinois", name: "Springfield", locality: "Springfield", region: "Illinois", country: "United States", latitude: 39.7984, longitude: -89.6549, timezone: "America/Chicago", type: "city" },
  { id: "us-mo-springfield", slug: "springfield-missouri", name: "Springfield", locality: "Springfield", region: "Missouri", country: "United States", latitude: 37.2089, longitude: -93.2923, timezone: "America/Chicago", type: "city" },
  { id: "us-ma-springfield", slug: "springfield-massachusetts", name: "Springfield", locality: "Springfield", region: "Massachusetts", country: "United States", latitude: 42.1015, longitude: -72.5898, timezone: "America/New_York", type: "city" },
  { id: "demo-frigid-pass", slug: "frigid-pass-demo", name: "Frigid Pass", locality: "Frigid Pass", region: "Colorado", country: "United States", latitude: 39.1, longitude: -106.2, timezone: "America/Denver", type: "mountain" }
];
