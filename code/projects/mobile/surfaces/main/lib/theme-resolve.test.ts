import {
  isThemePreference,
  resolveThemeName,
  THEME_PREFERENCES,
} from "./theme-resolve";

describe("theme preference logic", () => {
  describe("isThemePreference (stored-value guard)", () => {
    it("accepts every valid preference", () => {
      for (const p of THEME_PREFERENCES)
        expect(isThemePreference(p)).toBe(true);
    });

    it("rejects null, empty, and unknown / mis-cased values", () => {
      expect(isThemePreference(null)).toBe(false);
      expect(isThemePreference("")).toBe(false);
      expect(isThemePreference("System")).toBe(false); // case-sensitive
      expect(isThemePreference("auto")).toBe(false);
      expect(isThemePreference("dark ")).toBe(false);
    });
  });

  describe("resolveThemeName", () => {
    it("returns undefined for `system` so the ThemeProvider follows the OS", () => {
      expect(resolveThemeName("system")).toBeUndefined();
    });

    it("forces the chosen theme for light/dark", () => {
      expect(resolveThemeName("light")).toBe("light");
      expect(resolveThemeName("dark")).toBe("dark");
    });
  });
});
