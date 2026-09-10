import { describe, it, expect } from "vitest";
import { resolveConsentMode, resolveRegulation } from "./regions";

describe("resolveConsentMode", () => {
  it("opt-in across EU / EEA / UK and their in-scope territories", () => {
    for (const c of [
      "FR",
      "DE",
      "NO",
      "IS",
      "LI",
      "GB",
      "GI",
      "JE",
      "GF",
      "RE",
    ])
      expect(resolveConsentMode(c)).toBe("opt-in");
  });

  it("opt-out for the US", () => {
    expect(resolveConsentMode("US")).toBe("opt-out");
  });

  it("built-in LGPD / PIPEDA / POPIA are opt-in; Australia's Privacy Act is opt-out", () => {
    expect(resolveConsentMode("BR")).toBe("opt-in");
    expect(resolveConsentMode("CA")).toBe("opt-in");
    expect(resolveConsentMode("ZA")).toBe("opt-in");
    expect(resolveConsentMode("AU")).toBe("opt-out");
  });

  it("Australia's inhabited external territories inherit its opt-out default", () => {
    for (const c of ["NF", "CX", "CC"])
      expect(resolveConsentMode(c)).toBe("opt-out");
  });

  it("none for a country with no consent-banner law", () => {
    expect(resolveConsentMode("JP")).toBe("none");
    expect(resolveConsentMode("GL")).toBe("none"); // EU OCT — associated, not EU territory
  });

  it("external territories carry their in-scope default mode", () => {
    // EU outermost regions (France) + Åland → opt-in (part of the EU).
    for (const c of ["GF", "GP", "MQ", "YT", "RE", "MF", "AX"])
      expect(resolveConsentMode(c)).toBe("opt-in");
    // UK GDPR-equivalent territories → opt-in.
    for (const c of ["GI", "JE", "GG", "IM"])
      expect(resolveConsentMode(c)).toBe("opt-in");
    // US territories → inherit the US opt-out.
    for (const c of ["PR", "GU", "VI", "AS", "MP"])
      expect(resolveConsentMode(c)).toBe("opt-out");
    // French OCTs + other UK Overseas Territories → none by default.
    for (const c of ["PF", "NC", "BL", "BM", "KY", "FK"])
      expect(resolveConsentMode(c)).toBe("none");
  });

  it("unknown / missing country fails safe to opt-in", () => {
    expect(resolveConsentMode(null)).toBe("opt-in");
    expect(resolveConsentMode(undefined)).toBe("opt-in");
    expect(resolveConsentMode("")).toBe("opt-in");
  });

  it("Cloudflare unknown/Tor sentinels (XX/T1/T2) fail safe to opt-in", () => {
    for (const c of ["XX", "T1", "T2"])
      expect(resolveConsentMode(c)).toBe("opt-in");
  });

  it("is case-insensitive on the country code", () => {
    expect(resolveConsentMode("fr")).toBe("opt-in");
  });

  it("an override assigns a different regulation to a country", () => {
    expect(resolveConsentMode("US", { overrides: { US: "gdpr" } })).toBe(
      "opt-in",
    );
    expect(resolveConsentMode("CH", { overrides: { CH: "gdpr" } })).toBe(
      "opt-in",
    );
    expect(resolveConsentMode("FR", { overrides: { FR: "none" } })).toBe(
      "none",
    );
  });

  it("a parent-country override cascades to its territories", () => {
    expect(resolveConsentMode("PF", { overrides: { FR: "gdpr" } })).toBe(
      "opt-in",
    );
    expect(resolveConsentMode("GI", { overrides: { GB: "none" } })).toBe(
      "none",
    );
  });

  it("a per-territory override beats the parent override", () => {
    expect(
      resolveConsentMode("GP", { overrides: { FR: "none", GP: "gdpr" } }),
    ).toBe("opt-in");
  });
});

describe("resolveRegulation", () => {
  it("returns the named regulation for a country/territory", () => {
    expect(resolveRegulation("FR").name).toBe("GDPR");
    expect(resolveRegulation("GB").name).toBe("UK GDPR");
    expect(resolveRegulation("GI").name).toBe("UK GDPR");
    expect(resolveRegulation("US").name).toBe("CCPA/CPRA");
    expect(resolveRegulation("JP").name).toBe("None");
    expect(resolveRegulation("BR").name).toBe("LGPD");
    expect(resolveRegulation("CA").name).toBe("PIPEDA");
    expect(resolveRegulation("ZA").name).toBe("POPIA");
    expect(resolveRegulation("AU").name).toBe("Australia Privacy Act");
  });

  it("supports a client-defined regulation (flexible/extensible)", () => {
    const config = {
      regulations: { lgpd: { name: "LGPD", mode: "opt-in" as const } },
      overrides: { BR: "lgpd" },
    };
    expect(resolveRegulation("BR", config)).toEqual({
      name: "LGPD",
      mode: "opt-in",
    });
    expect(resolveConsentMode("BR", config)).toBe("opt-in");
  });
});
