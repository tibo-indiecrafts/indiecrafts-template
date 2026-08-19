import { describe, expect, it } from "vitest";
import { isIban, isPostalCode, isVatNumber } from "./validate";

// The branchy, high-risk validators: IBAN mod-97 check digits, EU VAT shape, and
// per-country postal codes with the permissive default. The looser checks
// (isEmail/isPhone) are simple regexes — left untested by design.
describe("isIban (mod-97)", () => {
  it("accepts valid IBANs, spaced or not", () => {
    expect(isIban("DE89370400440532013000")).toBe(true);
    expect(isIban("GB82 WEST 1234 5698 7654 32")).toBe(true);
    expect(isIban("FR1420041010050500013M02606")).toBe(true);
  });

  it("rejects a wrong check digit", () => {
    expect(isIban("DE89370400440532013001")).toBe(false);
  });

  it("rejects a malformed shape", () => {
    expect(isIban("XX12")).toBe(false);
    expect(isIban("1234370400440532013000")).toBe(false);
  });
});

describe("isVatNumber", () => {
  it("accepts a country prefix plus alphanumerics with a digit", () => {
    expect(isVatNumber("FR40303265045")).toBe(true);
    expect(isVatNumber("de123456789")).toBe(true);
  });

  it("rejects a body with no digit or a missing country prefix", () => {
    expect(isVatNumber("FRABCDEFGH")).toBe(false);
    expect(isVatNumber("12345678")).toBe(false);
  });
});

describe("isPostalCode", () => {
  it("applies the per-country pattern", () => {
    expect(isPostalCode("75001", "FR")).toBe(true);
    expect(isPostalCode("7500", "FR")).toBe(false);
    expect(isPostalCode("1012 AB", "NL")).toBe(true);
  });

  it("falls back to the permissive default for unknown countries", () => {
    expect(isPostalCode("ABC12", "ZZ")).toBe(true);
    expect(isPostalCode("!", "ZZ")).toBe(false);
  });
});
