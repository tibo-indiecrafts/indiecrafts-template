// No-login preference token — a thin wrapper over signHmac/verifyHmac (gated-delivery),
// narrowed to { uid, cat? }. New tokens carry a 1-year `exp`; legacy tokens without one
// stay valid so already-sent email links keep working.
import { signHmac } from "@indiecrafts/packages-shared-gated-delivery";
import { PREF_TOKEN_TTL_MS } from "./pref-token";
import { describe, expect, it } from "vitest";
import { signPrefToken, verifyPrefToken } from "./pref-token";

const SECRET = "test-pref-secret-do-not-use-in-prod";

describe("signPrefToken / verifyPrefToken", () => {
  it("round-trips { uid, cat }", async () => {
    const token = await signPrefToken(SECRET, "user_1", "news");
    expect(await verifyPrefToken(SECRET, token)).toEqual({
      uid: "user_1",
      cat: "news",
    });
  });

  it("round-trips { uid } with cat omitted", async () => {
    const token = await signPrefToken(SECRET, "user_1");
    const payload = await verifyPrefToken(SECRET, token);
    expect(payload).toEqual({ uid: "user_1" });
    expect(payload && "cat" in payload).toBe(false);
  });

  it("returns null on a wrong secret", async () => {
    const token = await signPrefToken(SECRET, "user_1", "news");
    expect(await verifyPrefToken("wrong-secret", token)).toBeNull();
  });

  it("returns null when the payload lacks a valid uid", async () => {
    const badToken = await signHmac({ cat: "news" }, SECRET);
    expect(await verifyPrefToken(SECRET, badToken)).toBeNull();
  });

  it("never throws on malformed input", async () => {
    await expect(verifyPrefToken(SECRET, "garbage")).resolves.toBeNull();
    await expect(verifyPrefToken(SECRET, "")).resolves.toBeNull();
  });

  it("rejects an expired token", async () => {
    const t0 = 1_000_000_000_000;
    const token = await signPrefToken(SECRET, "user_1", "news", t0);
    // Just after expiry → null; just before → still valid.
    expect(
      await verifyPrefToken(SECRET, token, t0 + PREF_TOKEN_TTL_MS + 1),
    ).toBeNull();
    expect(
      await verifyPrefToken(SECRET, token, t0 + PREF_TOKEN_TTL_MS - 1),
    ).toEqual({ uid: "user_1", cat: "news" });
  });

  it("keeps a legacy token (no exp) valid so old email links still work", async () => {
    const legacy = await signHmac({ uid: "user_1", cat: "news" }, SECRET);
    expect(await verifyPrefToken(SECRET, legacy)).toEqual({
      uid: "user_1",
      cat: "news",
    });
  });
});
