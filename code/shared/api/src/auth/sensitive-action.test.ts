import { describe, expect, it } from "vitest";
import { requireStepUp, type SelfAuth } from "./sensitive-action";

const CORS = { "access-control-allow-origin": "*" };
const authed = (fvaMinutes: number | null): SelfAuth => ({
  userId: "u",
  email: "u@x.com",
  fvaMinutes,
});

describe("requireStepUp", () => {
  it("allows a fresh first factor (<= window) → null", () => {
    expect(requireStepUp(authed(0), CORS)).toBeNull();
    expect(requireStepUp(authed(5), CORS)).toBeNull();
    expect(requireStepUp(authed(10), CORS)).toBeNull();
  });

  it("denies (403) a stale, absent, or not-applicable first factor", async () => {
    for (const fva of [null, -1, 11, 999]) {
      const res = requireStepUp(authed(fva), CORS);
      expect(res?.status).toBe(403);
      // Body is Clerk's reverification error shape the client's useReverification reads.
      const body = (await res!.json()) as Record<string, unknown>;
      expect(JSON.stringify(body).length).toBeGreaterThan(0);
    }
  });

  it("honours a custom window", () => {
    expect(requireStepUp(authed(20), CORS, 30)).toBeNull(); // 20 <= 30 → allow
    expect(requireStepUp(authed(40), CORS, 30)?.status).toBe(403); // 40 > 30 → deny
  });

  it("echoes the caller's CORS headers on the 403", () => {
    const res = requireStepUp(authed(null), CORS);
    expect(res?.headers.get("access-control-allow-origin")).toBe("*");
  });
});
