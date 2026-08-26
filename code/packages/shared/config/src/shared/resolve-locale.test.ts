import { describe, expect, it } from "vitest";
import { resolveLocale } from "./i18n";
import { defaultLocale } from "./i18n";

describe("resolveLocale", () => {
  it("returns the first supported candidate", () => {
    expect(resolveLocale("fr", "en")).toBe("fr");
  });
  it("skips unsupported / empty candidates", () => {
    expect(resolveLocale(undefined, "zz", "en")).toBe("en");
  });
  it("falls back to the default locale when none is supported", () => {
    expect(resolveLocale(null, "zz")).toBe(defaultLocale);
  });
});
