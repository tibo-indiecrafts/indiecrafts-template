import { describe, expect, it } from "vitest";
import { BRANDS, BRAND_NAMES, isBrand } from "./brands";

// brands.ts is generated (`pnpm brands:build`); this guards that every mark is
// renderable — a non-empty 24×24 path + a `#RRGGBB` hex — so a bad slug/override
// can't ship a blank icon.
describe("brands (generated)", () => {
  it("every brand has a valid title, hex, and 24×24 path", () => {
    for (const name of BRAND_NAMES) {
      const mark = BRANDS[name];
      expect(mark.title.length).toBeGreaterThan(0);
      expect(mark.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(mark.path.length).toBeGreaterThan(20);
      expect(mark.path.startsWith("M")).toBe(true);
    }
  });

  it("isBrand narrows to known names", () => {
    expect(isBrand("x")).toBe(true);
    expect(isBrand("linkedin")).toBe(true);
    expect(isBrand("not-a-brand")).toBe(false);
  });
});
