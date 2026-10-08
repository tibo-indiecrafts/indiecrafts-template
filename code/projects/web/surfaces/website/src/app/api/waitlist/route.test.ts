// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({
  waitlist: true,
  enabled: true as boolean | undefined,
}));
const join = vi.hoisted(() => vi.fn());
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      get waitlist() {
        return flags.waitlist;
      },
    },
  };
});
vi.mock("@indiecrafts/modules-web-waitlist/lib/waitlist", () => ({ join }));
vi.mock("@indiecrafts/modules-web-waitlist/lib/settings", () => ({
  getWaitlistSettings: async () => ({ enabled: flags.enabled }),
}));
vi.mock("@indiecrafts/packages-web-compliance/sanity/policy-version", () => ({
  getConsentPolicyVersion: async () => "v1",
}));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: async () => ({ ok: true }),
}));

const { POST } = await import("./route");
// Node env: happy-dom's Request drops the forbidden `Sec-Fetch-Site` header.
const post = (body: unknown, site = "same-origin") =>
  POST(
    new Request("https://x.test/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": site },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
const valid = { email: "a@b.com", consent: true };

beforeEach(() => {
  flags.waitlist = true;
  flags.enabled = true;
  join.mockReset();
});

describe("POST /api/waitlist", () => {
  it("answers new, known and spam joins alike — 201, same body (no membership oracle)", async () => {
    for (const result of [
      { ok: true, already: false },
      { ok: true, already: true },
      { ok: false, error: "spam" },
    ]) {
      join.mockResolvedValueOnce(result);
      const res = await post(valid);
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ ok: true });
    }
  });

  it("an invalid join → 400, with the server's policy version", async () => {
    join.mockResolvedValueOnce({ ok: false, error: "invalid" });
    const res = await post({ email: "nope", consent: true, policyVersion: "forged" });
    expect(res.status).toBe(400);
    expect(join.mock.calls[0]?.[2]).toBe("v1");
  });

  it("the guard refuses cross-site, oversize and malformed bodies before the engine", async () => {
    expect((await post(valid, "cross-site")).status).toBe(403);
    expect((await post({ ...valid, name: "x".repeat(9000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect(join).not.toHaveBeenCalled();
  });

  it("is a 404 with the flag off or the Studio toggle off", async () => {
    flags.waitlist = false;
    expect((await post(valid)).status).toBe(404);
    flags.waitlist = true;
    flags.enabled = false;
    expect((await post(valid)).status).toBe(404);
    expect(join).not.toHaveBeenCalled();
  });
});
