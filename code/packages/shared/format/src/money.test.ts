import { describe, expect, it } from "vitest";
import {
  convert,
  formatMoney,
  netFromGross,
  parseMoney,
  toCents,
  withVat,
} from "./money";

describe("formatMoney", () => {
  it("formats currency per locale (EUR)", () => {
    const en = formatMoney(1234.56, { locale: "en" });
    expect(en).toContain("€");
    expect(en).toMatch(/1[,.\s ]?234/); // grouped thousands (separator varies by Intl)
    const fr = formatMoney(1234.56, { locale: "fr" });
    expect(fr).toContain("€");
    expect(fr).toMatch(/234/);
  });
  it("cents divides by 100", () => {
    expect(formatMoney(1999, { locale: "en", cents: true })).toContain("19");
  });
});

describe("parseMoney", () => {
  it("handles EU and US decimal styles", () => {
    expect(parseMoney("1 234,56 €")).toBe(1234.56);
    expect(parseMoney("$1,234.56")).toBe(1234.56);
    expect(parseMoney("12,50")).toBe(12.5);
  });
});

describe("VAT + convert", () => {
  it("withVat / netFromGross round-trip at 20%", () => {
    expect(withVat(100)).toBe(120);
    expect(netFromGross(120)).toBe(100);
  });
  it("convert uses the rates table + its inverse", () => {
    expect(
      convert(10, { from: "USD", to: "EUR", rates: { "USD>EUR": 0.9 } }),
    ).toBe(9);
    expect(
      convert(9, { from: "EUR", to: "USD", rates: { "USD>EUR": 0.9 } }),
    ).toBe(10);
    expect(() => convert(1, { from: "USD", to: "JPY", rates: {} })).toThrow();
  });
  it("toCents rounds", () => {
    expect(toCents(19.99)).toBe(1999);
  });
});
