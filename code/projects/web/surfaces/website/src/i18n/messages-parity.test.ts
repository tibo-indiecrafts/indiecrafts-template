import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

/**
 * Every locale must carry the SAME message key paths. next-intl resolves strictly, so a key
 * present in `en` but missing in `fr` (or vice-versa) fails that page — today only at build
 * (prerender × locale). This guards parity as a fast unit test, before the build. Adding a
 * locale? Add its file here.
 */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return [prefix];
  return Object.entries(value).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("messages key parity", () => {
  it("en and fr expose identical key paths", () => {
    const enKeys = new Set(keyPaths(en));
    const frKeys = new Set(keyPaths(fr));
    const missingInFr = [...enKeys].filter((k) => !frKeys.has(k)).sort();
    const missingInEn = [...frKeys].filter((k) => !enKeys.has(k)).sort();
    expect({ missingInFr, missingInEn }).toEqual({ missingInFr: [], missingInEn: [] });
  });
});
