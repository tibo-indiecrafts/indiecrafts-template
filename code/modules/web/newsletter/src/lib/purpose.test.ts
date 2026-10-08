import { describe, expect, it } from "vitest";
import { LEAD_MAGNET_SOURCE, wantsNewsletter } from "./purpose";

describe("wantsNewsletter", () => {
  it("follows the stored consent when the doc has it", () => {
    expect(
      wantsNewsletter({ newsletter: true, source: LEAD_MAGNET_SOURCE }),
    ).toBe(true);
    expect(wantsNewsletter({ newsletter: false, source: "/blog" })).toBe(false);
  });

  it("treats an older doc (no field) as a newsletter sign-up unless it came from a lead magnet", () => {
    expect(wantsNewsletter({ source: "/blog" })).toBe(true);
    expect(wantsNewsletter({})).toBe(true);
    expect(wantsNewsletter({ source: LEAD_MAGNET_SOURCE })).toBe(false);
  });
});
