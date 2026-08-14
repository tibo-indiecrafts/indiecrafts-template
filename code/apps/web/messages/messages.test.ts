import { describe, expect, it } from "vitest";
import en from "./en.json";
import fr from "./fr.json";

// Every user-facing string lives in messages/<locale>.json. A missing key in one
// locale silently ships an untranslated (or crashing) string — so the locale files
// must have identical key sets. This test fails the moment they drift.
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

// Keys that intentionally exist in one locale only — locale-specific typography /
// formatting, not a UI string that needs a counterpart. Add here (with a reason)
// when a difference is deliberate; anything else is a real translation gap.
const LOCALE_SPECIFIC = [
  "typography.nonBreakingSpaceBeforePunctuation", // French: NBSP before ; : ! ?
];
const isLocaleSpecific = (k: string) =>
  LOCALE_SPECIFIC.some((p) => k === p || k.startsWith(`${p}.`));

describe("i18n message parity", () => {
  it("en.json and fr.json cover the same keys (bar documented locale-specifics)", () => {
    const enKeys = new Set(keyPaths(en));
    const frKeys = new Set(keyPaths(fr));
    const missingInFr = [...enKeys].filter((k) => !frKeys.has(k) && !isLocaleSpecific(k));
    const missingInEn = [...frKeys].filter((k) => !enKeys.has(k) && !isLocaleSpecific(k));
    expect({ missingInFr, missingInEn }).toEqual({ missingInFr: [], missingInEn: [] });
  });
});
