import { describe, it, expect, vi } from "vitest";
import { parseEnvironment } from "./env";

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
