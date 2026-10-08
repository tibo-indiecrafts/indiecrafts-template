// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ newsletter: true }));
const subscribe = vi.hoisted(() => vi.fn());
const confirmSubscriber = vi.hoisted(() => vi.fn());
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: new Proxy(real.features, {
      get: (t, k) => (k === "newsletter" ? flags.newsletter : Reflect.get(t, k)),
    }),
  };
});
vi.mock("@indiecrafts/modules-web-newsletter/lib/newsletter", () => ({ subscribe }));
vi.mock("@indiecrafts/modules-web-newsletter/lib/confirm", () => ({ confirmSubscriber }));
vi.mock("@indiecrafts/packages-web-compliance/sanity/policy-version", () => ({
  getConsentPolicyVersion: async () => "v1",
}));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: async () => ({ ok: true }),
}));

const { POST: subscribeRoute } = await import("./route");
const { POST: confirmRoute } = await import("./confirm/route");

const post = (handler: (r: Request) => Promise<Response>, body: unknown) =>
  handler(
    new Request("https://x.test/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  flags.newsletter = true;
  subscribe.mockReset();
  confirmSubscriber.mockReset();
});

describe("POST /api/newsletter", () => {
  it("answers new, known and spam sign-ups alike — 201, same body (no membership oracle)", async () => {
    for (const result of [
      { ok: true, already: false },
      { ok: true, already: true },
      { ok: false, error: "spam" },
    ]) {
      subscribe.mockResolvedValueOnce(result);
      const res = await post(subscribeRoute, { email: "a@b.com", consent: true });
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ ok: true });
    }
  });

  it("an invalid sign-up → 400, and the policy version comes from the server, not the request", async () => {
    subscribe.mockResolvedValueOnce({ ok: false, error: "invalid" });
    const res = await post(subscribeRoute, {
      email: "nope",
      consent: true,
      policyVersion: "forged",
    });
    expect(res.status).toBe(400);
    expect(subscribe.mock.calls[0]?.[2]).toBe("v1");
  });

  it("both routes are a 404 with the flag off, and never reach the engine", async () => {
    flags.newsletter = false;
    expect((await post(subscribeRoute, { email: "a@b.com", consent: true })).status).toBe(
      404,
    );
    expect((await post(confirmRoute, { token: "t" })).status).toBe(404);
    expect(subscribe).not.toHaveBeenCalled();
    expect(confirmSubscriber).not.toHaveBeenCalled();
  });
});

describe("POST /api/newsletter/confirm", () => {
  it("reports the engine's outcome for the posted token", async () => {
    confirmSubscriber.mockResolvedValueOnce("confirmed").mockResolvedValueOnce("invalid");
    expect(await (await post(confirmRoute, { token: "good" })).json()).toEqual({
      status: "confirmed",
    });
    expect(await (await post(confirmRoute, { token: "expired" })).json()).toEqual({
      status: "invalid",
    });
    expect(confirmSubscriber).toHaveBeenNthCalledWith(1, "good");
  });
});
