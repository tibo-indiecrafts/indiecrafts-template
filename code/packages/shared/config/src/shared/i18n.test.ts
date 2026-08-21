import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  isLocale,
  localeCodes,
  localeDir,
  localePrefix,
  localizedPathname,
  pickSuggestedLocale,
} from "./index";

// Guards the URL-prefix policy + the locale type-guard. The live `localePrefix`
// mode is "as-needed" (fixed by the `satisfies` on `i18n`), so these assert its
// real behaviour: the default locale is unprefixed, every other locale gets `/<code>`.
describe("@indiecrafts/packages-shared-config i18n", () => {
  it("localePrefix leaves the default locale unprefixed, prefixes the rest", () => {
    expect(localePrefix(defaultLocale)).toBe("");
    const other = localeCodes.find((c) => c !== defaultLocale)!;
    expect(localePrefix(other)).toBe(`/${other}`);
  });

  it("localizedPathname applies the same prefix policy", () => {
    const other = localeCodes.find((c) => c !== defaultLocale)!;
    expect(localizedPathname("/blog", defaultLocale)).toBe("/blog");
    expect(localizedPathname("/blog", other)).toBe(`/${other}/blog`);
  });

  it("localeDir falls back to ltr for an unknown code", () => {
    expect(localeDir(defaultLocale)).toBe("ltr");
    expect(localeDir("zz" as (typeof localeCodes)[number])).toBe("ltr");
  });

  it("isLocale accepts a registered code and rejects others", () => {
    expect(isLocale(defaultLocale, localeCodes)).toBe(true);
    expect(isLocale("zz", localeCodes)).toBe(false);
  });

  it("pickSuggestedLocale returns the first supported preference that differs from active", () => {
    // First supported pref ("fr") differs from active ("en") → suggest it.
    expect(pickSuggestedLocale(["fr", "en"], "en", localeCodes)).toBe("fr");
    // First supported pref already matches active → no suggestion.
    expect(pickSuggestedLocale(["en", "fr"], "en", localeCodes)).toBe(null);
    // Unsupported prefs are skipped before the decision.
    expect(pickSuggestedLocale(["de", "es", "fr"], "en", localeCodes)).toBe("fr");
    // None supported → null.
    expect(pickSuggestedLocale(["de", "es"], "en", localeCodes)).toBe(null);
  });
});
