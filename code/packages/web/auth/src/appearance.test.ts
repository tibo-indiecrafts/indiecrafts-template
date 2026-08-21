import { describe, expect, it } from "vitest";
import { authAppearance } from "./appearance";

describe("authAppearance", () => {
  it("references design tokens, never a hard-coded color", () => {
    const vars = authAppearance().variables;
    // Every colour must be a `var(--token)` reference — a raw hex/oklch here would
    // be a hard-coded brand color (a config-first NEVER).
    for (const [key, value] of Object.entries(vars)) {
      if (key.startsWith("color")) {
        expect(value).toMatch(/^var\(--[a-z-]+\)$/);
      }
    }
    expect(vars.colorPrimary).toBe("var(--primary)");
  });
});
