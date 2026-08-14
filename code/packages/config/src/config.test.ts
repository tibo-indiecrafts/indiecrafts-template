import { describe, expect, it } from "vitest";
import { features, pages, site } from "./index";

// The config brick is the single source of truth for brand, feature flags, and
// page visibility. These guard its shape so a typo (or a renamed flag) is caught
// before it silently disables a surface.
describe("@indiecrafts/config", () => {
  it("exposes the core capability flags as booleans", () => {
    expect(typeof features.blog).toBe("boolean");
    expect(typeof features.studio).toBe("boolean");
    // Every flag is a boolean or a nested group of booleans — never undefined/other.
    for (const [flag, value] of Object.entries(features)) {
      const ok =
        typeof value === "boolean" ||
        (typeof value === "object" &&
          value !== null &&
          Object.values(value).every((v) => typeof v === "boolean"));
      expect(
        ok,
        `features.${flag} must be a boolean or a group of booleans`,
      ).toBe(true);
    }
  });

  it("has a site url and a non-empty pages map", () => {
    expect(site.url).toMatch(/^https?:\/\//);
    expect(Object.keys(pages).length).toBeGreaterThan(0);
  });
});
