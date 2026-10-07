import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { CHURN_REASON_CODES } from "@indiecrafts/packages-shared-compliance/shared";
import {
  writeChurnEvent,
  readChurnEvent,
  readChurnAggregate,
  normalizeReason,
} from "./churn-store";

const db = () => env.MAIN_DB!;

describe("churn-store", () => {
  it("normalizeReason keeps preset codes, nulls the rest", () => {
    for (const code of CHURN_REASON_CODES) {
      expect(normalizeReason(code)).toBe(code);
    }
    expect(normalizeReason("nonsense")).toBeNull();
    expect(normalizeReason("TOO_EXPENSIVE")).toBeNull();
    expect(normalizeReason(undefined)).toBeNull();
  });

  it("writes then reads a churn row", async () => {
    await writeChurnEvent(
      db(),
      "user_a",
      { reason: "too_expensive", feedback: "too pricey", competitor: "Acme" },
      new Date().toISOString(),
    );
    expect(await readChurnEvent(db(), "user_a")).toEqual({
      reason: "too_expensive",
    });
    expect(await readChurnEvent(db(), "missing")).toBeNull();
  });

  it("aggregates totals, reasons, and recent feedback", async () => {
    await writeChurnEvent(
      db(),
      "user_b",
      { reason: "not_using" },
      "2026-09-01T00:00:00.000Z",
    );
    await writeChurnEvent(
      db(),
      "user_c",
      { reason: "not_using", feedback: "hi" },
      "2026-09-01T00:00:00.000Z",
    );
    const agg = await readChurnAggregate(db());
    expect(agg.total).toBeGreaterThanOrEqual(2);
    expect(
      agg.byReason.find((r) => r.reason === "not_using")?.count,
    ).toBeGreaterThanOrEqual(2);
    expect(agg.recentFeedback.some((f) => f.feedback === "hi")).toBe(true);
  });
});
