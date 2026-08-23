import { describe, expect, it } from "vitest";
import { retentionCutoff } from "./index";

describe("retentionCutoff", () => {
  it("computes the ISO cutoff for a given window", () => {
    const now = Date.UTC(2026, 0, 31); // 2026-01-31T00:00:00Z
    // 90 days before
    expect(retentionCutoff(now, 90)).toBe(
      new Date(now - 90 * 86_400_000).toISOString(),
    );
    // 3 years (1095 days) before is much earlier than 90 days
    expect(retentionCutoff(now, 1095) < retentionCutoff(now, 90)).toBe(true);
  });
});
