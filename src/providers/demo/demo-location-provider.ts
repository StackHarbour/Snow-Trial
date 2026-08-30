import type { LocationProvider } from "@/providers/contracts";
import type { LocationSearchResult } from "@/domain/location/types";
import { demoLocations } from "@/providers/demo/demo-locations";

const zipMatches: Record<string, string> = { "80202": "denver-colorado", "80435": "breckenridge-colorado" };

export class DemoLocationProvider implements LocationProvider {
  async search(rawQuery: string): Promise<LocationSearchResult> {
    const query = rawQuery.trim();
    if (!query) return { kind: "no-result", query };
    if (/^\d{1,5}$/.test(query)) {
      const slug = zipMatches[query];
      return slug ? { kind: "resolved", location: demoLocations.find((item) => item.slug === slug)! } : { kind: "invalid-zip", query };
    }
    const normalized = query.toLowerCase();
    if (normalized === "springfield") return { kind: "ambiguous", query, candidates: demoLocations.filter((item) => item.locality === "Springfield") };
    const location = demoLocations.find((item) => [item.name, `${item.name}, ${item.region}`, item.slug.replace("-", " ")].some((value) => value.toLowerCase() === normalized));
    if (location?.slug === "frigid-pass-demo") return { kind: "unsupported", query, location };
    return location ? { kind: "resolved", location } : { kind: "no-result", query };
  }

  async getBySlug(slug: string) { return demoLocations.find((item) => item.slug === slug) ?? null; }
}
