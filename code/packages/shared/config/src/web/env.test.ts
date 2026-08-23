import { describe, it, expect, vi, afterEach } from "vitest";
import { parseEnvironment, getClerkCspHosts } from "./env";

describe("parseEnvironment", () => {
  it("accepts every known environment", () => {
    for (const e of ["development", "staging", "test", "production"] as const) {
      expect(parseEnvironment(e)).toBe(e);
    }
  });

  it("returns undefined for empty / unset (fall back to NODE_ENV)", () => {
    expect(parseEnvironment(undefined)).toBeUndefined();
    expect(parseEnvironment("")).toBeUndefined();
  });

  it("warns and returns undefined for an unknown value (no silent degrade)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseEnvironment("prod")).toBeUndefined();
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain("prod");
    warn.mockRestore();
  });
});

describe("getClerkCspHosts", () => {
  const KEY = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY";
  const original = process.env[KEY];
  const empty = { script: [], connect: [], img: [], frame: [], worker: [] };
  afterEach(() => {
    if (original === undefined) delete process.env[KEY];
    else process.env[KEY] = original;
  });

  it("returns all-empty when the key is unset (CSP unchanged)", () => {
    delete process.env[KEY];
    expect(getClerkCspHosts()).toEqual(empty);
  });

  it("derives the Frontend-API host from a publishable key", () => {
    // pk_test_ + base64("clerk.example.com$")
    process.env[KEY] = "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k";
    expect(getClerkCspHosts()).toEqual({
      script: ["https://clerk.example.com"],
      connect: ["https://clerk.example.com", "https://clerk-telemetry.com"],
      img: ["https://img.clerk.com"],
      frame: ["https://clerk.example.com"],
      worker: ["blob:"],
    });
  });

  it("fails safe (all-empty) on a key with no decodable host", () => {
    process.env[KEY] = "pk_test_"; // empty payload → no host → no hosts, not a broken build
    expect(getClerkCspHosts()).toEqual(empty);
  });
});
