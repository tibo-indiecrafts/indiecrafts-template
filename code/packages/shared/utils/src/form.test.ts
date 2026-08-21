import { describe, it, expect } from "vitest";
import { isSpam, tooFast, isValidEmail, cleanList } from "./form";

describe("isSpam", () => {
  it("flags a filled honeypot", () => {
    expect(isSpam({ honeypot: "x" })).toBe(true);
    expect(isSpam({ honeypot: "  " })).toBe(false); // whitespace-only is empty
  });
  it("flags a too-fast submit and passes a human-paced one", () => {
    expect(isSpam({ startedAt: Date.now() })).toBe(true); // ~0ms elapsed
    expect(isSpam({ startedAt: Date.now() - 5000 })).toBe(false);
  });
  it("passes when neither signal is present", () => {
    expect(isSpam({})).toBe(false);
  });
});

describe("tooFast", () => {
  it("is skew-safe: a client clock ahead (negative elapsed) never flags", () => {
    expect(tooFast(Date.now() + 10_000)).toBe(false);
  });
  it("ignores a missing timestamp", () => {
    expect(tooFast(undefined)).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts a plausible address, case/space-insensitively", () => {
    expect(isValidEmail("  A@b.co ")).toBe(true);
  });
  it("rejects empty, malformed, or over-long", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail(`${"a".repeat(250)}@b.co`)).toBe(false);
  });
});

describe("cleanList", () => {
  it("trims and drops empties, tolerates null/undefined", () => {
    expect(cleanList([" a ", "", "b", "  "])).toEqual(["a", "b"]);
    expect(cleanList(null)).toEqual([]);
    expect(cleanList(undefined)).toEqual([]);
  });
});
