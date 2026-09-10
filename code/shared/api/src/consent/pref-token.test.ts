// No-login preference token — a thin wrapper over signHmac/verifyHmac (gated-delivery),
// narrowed to { uid, cat? }. No expiry: links in already-sent mail must keep working.
import { signHmac } from "@indiecrafts/packages-shared-gated-delivery";
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
});
