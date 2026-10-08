// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const revalidatePath = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidatePath }));

const { POST } = await import("./route");
const SECRET = "test-webhook-secret";
const BODY = JSON.stringify({ _id: "post-1", _type: "post" });

// Sanity's webhook signature: `t=<ms>,v1=<base64url HMAC-SHA256 of "<t>.<body>">`.
const sign = (secret: string, body = BODY, t = Date.now()) =>
  `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url")}`;
const req = (signature?: string, body = BODY) =>
  new NextRequest("https://x.test/api/revalidate", {
    method: "POST",
    body,
    headers: {
      "content-type": "application/json",
      ...(signature ? { "sanity-webhook-signature": signature } : {}),
    },
  });

afterEach(() => {
  vi.unstubAllEnvs();
  revalidatePath.mockClear();
});

describe("POST /api/revalidate", () => {
  it("503s when the secret is not set", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "");
    expect((await POST(req(sign(SECRET)))).status).toBe(503);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    ["no signature", undefined, BODY],
    ["a wrong secret", sign("other-secret"), BODY],
    ["a changed body", sign(SECRET), JSON.stringify({ _type: "evil" })],
  ])(
    "401s with %s",
    async (_label, signature, body) => {
      vi.stubEnv("SANITY_REVALIDATE_SECRET", SECRET);
      expect((await POST(req(signature, body))).status).toBe(401);
      expect(revalidatePath).not.toHaveBeenCalled();
    },
    10_000,
  );

  it("purges the whole site on a valid signature", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", SECRET);
    const res = await POST(req(sign(SECRET)));
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  }, 10_000);
});
