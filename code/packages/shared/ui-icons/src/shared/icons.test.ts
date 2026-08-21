import { describe, it, expect } from "vitest";
import { GLYPHS, glyphOptions, isGlyph } from "./glyphs";
import { BRANDS, BRAND_NAMES, isBrand } from "./brands";

describe("glyphs", () => {
  it("glyphOptions is the single source — one option per glyph, values === GLYPHS", () => {
    const opts = glyphOptions();
    expect(opts.map((o) => o.value)).toEqual([...GLYPHS]);
    expect(opts.every((o) => o.title.length > 0)).toBe(true);
  });
  it("keeps the feature-grid originals (stored content) first", () => {
    expect(GLYPHS.slice(0, 6)).toEqual([
      "zap",
      "settings",
      "sparkles",
      "shield",
      "globe",
      "users",
    ]);
  });
  it("has no duplicate names", () => {
    expect(new Set(GLYPHS).size).toBe(GLYPHS.length);
  });
  it("isGlyph narrows known/unknown names", () => {
    expect(isGlyph("shield")).toBe(true);
    expect(isGlyph("not-an-icon")).toBe(false);
  });
});

describe("brands", () => {
  it("every brand has a 24x24-path mark + hex", () => {
    for (const name of BRAND_NAMES) {
      const mark = BRANDS[name];
      expect(mark.path.length).toBeGreaterThan(10);
      expect(mark.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(mark.title.length).toBeGreaterThan(0);
    }
  });
  it("isBrand narrows known/unknown names", () => {
    expect(isBrand("github")).toBe(true);
    expect(isBrand("myspace")).toBe(false);
  });
});
