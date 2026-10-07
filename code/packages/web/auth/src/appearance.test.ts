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

  it("puts Clerk's page titles on the token type scale", () => {
    expect(authAppearance().elements.headerTitle).toEqual({
      fontSize: "var(--text-lg)",
      lineHeight: "var(--text-lg--line-height)",
      fontWeight: "var(--font-weight-semibold)",
    });
  });

  it("hides Clerk's own Delete account section (deletion goes through Your data)", () => {
    expect(authAppearance().elements.profileSection__danger).toEqual({
      display: "none",
    });
  });

  it("hides social sign-in only inside the native shell", () => {
    const { socialButtonsRoot, dividerRow } = authAppearance().elements;
    const hidden = { "html[data-native-shell] &": { display: "none" } };
    expect(socialButtonsRoot).toEqual(hidden);
    expect(dividerRow).toEqual(hidden);
  });

  it("gives Clerk's badges readable token text (Lighthouse color-contrast)", () => {
    expect(authAppearance().elements.badge).toEqual({
      color: "var(--muted-foreground)",
    });
  });
});
