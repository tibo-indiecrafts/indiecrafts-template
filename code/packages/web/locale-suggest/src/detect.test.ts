import { describe, expect, it } from "vitest";
import { detectPreferredLocale } from "./detect";

const locales = ["en", "fr"];

describe("detectPreferredLocale", () => {
  it("suggests the top supported preference when it differs from active", () => {
    expect(
      detectPreferredLocale("fr-FR,fr;q=0.9,en;q=0.8", "en", locales),
    ).toBe("fr");
  });

  it("returns null when the top supported preference IS the active locale", () => {
    expect(
      detectPreferredLocale("en-US,en;q=0.9,fr;q=0.8", "en", locales),
    ).toBeNull();
  });

  it("skips unsupported languages and uses the first supported one", () => {
    expect(
      detectPreferredLocale("de-DE,de;q=0.9,fr;q=0.8", "en", locales),
    ).toBe("fr");
  });

  it("returns null when no listed language is supported", () => {
    expect(detectPreferredLocale("de,es", "en", locales)).toBeNull();
  });

  it("respects q-value ordering, not list order", () => {
    expect(detectPreferredLocale("en;q=0.5,fr;q=0.9", "en", locales)).toBe(
      "fr",
    );
  });

  it("returns null on an empty or missing header", () => {
    expect(detectPreferredLocale("", "en", locales)).toBeNull();
    expect(detectPreferredLocale(null, "en", locales)).toBeNull();
  });
});
