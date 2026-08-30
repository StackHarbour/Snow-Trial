import { describe, expect, it } from "vitest";
import { resolveLocation } from "@/services/location-service";

describe("demo location resolution", () => {
  it("returns a canonical location for a valid ZIP", async () => { const result = await resolveLocation("80435"); expect(result.kind).toBe("resolved"); if (result.kind === "resolved") expect(result.location.slug).toBe("breckenridge-colorado"); });
  it("never guesses an ambiguous Springfield", async () => { const result = await resolveLocation("Springfield"); expect(result.kind).toBe("ambiguous"); if (result.kind === "ambiguous") expect(result.candidates).toHaveLength(3); });
  it("identifies invalid ZIP values", async () => { expect((await resolveLocation("00000")).kind).toBe("invalid-zip"); });
});
