import { describe, expect, it } from "vitest";

import {
  extractIpFromHeadersList,
  isValidIpAddress,
  sanitizeIpAddress,
} from "./ip";

describe("isValidIpAddress", () => {
  it("accepts valid IPv4", () => {
    expect(isValidIpAddress("192.168.1.1")).toBe(true);
    expect(isValidIpAddress("0.0.0.0")).toBe(true);
    expect(isValidIpAddress("255.255.255.255")).toBe(true);
  });

  it("rejects malformed IPv4 (range, leading zero, arity)", () => {
    expect(isValidIpAddress("256.0.0.1")).toBe(false);
    expect(isValidIpAddress("01.2.3.4")).toBe(false);
    expect(isValidIpAddress("1.2.3")).toBe(false);
    expect(isValidIpAddress("1.2.3.4.5")).toBe(false);
  });

  it("accepts IPv6 full, compressed, zoned, and IPv4-mapped", () => {
    expect(isValidIpAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(
      true,
    );
    expect(isValidIpAddress("2001:db8::8a2e:370:7334")).toBe(true);
    expect(isValidIpAddress("::1")).toBe(true);
    expect(isValidIpAddress("fe80::1%eth0")).toBe(true);
    expect(isValidIpAddress("::ffff:192.168.1.1")).toBe(true);
  });

  it("rejects garbage and injection attempts", () => {
    expect(isValidIpAddress("invalid")).toBe(false);
    expect(isValidIpAddress("192.168.1.1; DROP TABLE users;")).toBe(false);
    expect(isValidIpAddress("2001::db8::1")).toBe(false);
  });
});

describe("sanitizeIpAddress", () => {
  it("trims + returns a valid IP, null otherwise", () => {
    expect(sanitizeIpAddress("  192.168.1.1  ")).toBe("192.168.1.1");
    expect(sanitizeIpAddress("nope")).toBeNull();
    expect(sanitizeIpAddress(null)).toBeNull();
    expect(sanitizeIpAddress(undefined)).toBeNull();
    expect(sanitizeIpAddress("")).toBeNull();
  });
});

describe("extractIpFromHeadersList", () => {
  const list = (h: Record<string, string>) => ({
    get: (k: string) => h[k] ?? null,
  });

  it("takes the first x-forwarded-for hop, then x-real-ip, then unknown", () => {
    expect(
      extractIpFromHeadersList(list({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" })),
    ).toBe("1.1.1.1");
    expect(extractIpFromHeadersList(list({ "x-real-ip": "3.3.3.3" }))).toBe(
      "3.3.3.3",
    );
    expect(extractIpFromHeadersList(list({}))).toBe("unknown");
  });
});
