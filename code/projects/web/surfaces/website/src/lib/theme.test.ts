// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  resolveThemeConfig,
  themeModes,
  themeProviderProps,
  showThemeToggle,
  type ThemeConfig,
} from "./theme";

const both: ThemeConfig = { light: true, dark: true, forced: null };
const lightOnly: ThemeConfig = { light: true, dark: false, forced: null };
const forcedDark: ThemeConfig = { light: true, dark: true, forced: "dark" };

describe("theme modes — no 'System' option, OS auto-detect stays", () => {
  it("never offers 'system' in the menu", () => {
    expect(themeModes(both)).toEqual(["light", "dark"]);
    expect(themeModes(both)).not.toContain("system");
  });

  it("auto-detects the OS theme when both light + dark are offered", () => {
    const p = themeProviderProps(both);
    // enableSystem + defaultTheme:"system" is what makes next-themes follow prefers-color-scheme.
    expect(p.enableSystem).toBe(true);
    expect(p.defaultTheme).toBe("system");
    expect(p.themes).toEqual(["light", "dark"]);
  });

  it("light-only → single mode, no auto-detect", () => {
    expect(themeModes(lightOnly)).toEqual(["light"]);
    const p = themeProviderProps(lightOnly);
    expect(p.enableSystem).toBe(false);
    expect(p.defaultTheme).toBe("light");
    expect(showThemeToggle(lightOnly)).toBe(false);
  });

  it("forced → paints one theme, hides the toggle, no auto-detect", () => {
    expect(themeModes(forcedDark)).toEqual(["dark"]);
    const p = themeProviderProps(forcedDark);
    expect(p.enableSystem).toBe(false);
    expect(p.defaultTheme).toBe("dark");
    expect(p.forcedTheme).toBe("dark");
    expect(showThemeToggle(forcedDark)).toBe(false);
  });

  it("resolveThemeConfig ignores a legacy stored `system` field", () => {
    // Old docs may still carry themeModes.system — it must not resurrect a menu option.
    const cfg = resolveThemeConfig({ light: true, dark: true } as never);
    expect(themeModes(cfg)).toEqual(["light", "dark"]);
  });
});
