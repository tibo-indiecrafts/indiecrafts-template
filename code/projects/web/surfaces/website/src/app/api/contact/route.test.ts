// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ contact: true, enabled: true as boolean | undefined }));
const submit = vi.hoisted(() => vi.fn());
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      get contact() {
        return flags.contact;
      },
    },
  };
});
vi.mock("@indiecrafts/modules-web-contact/lib/contact", () => ({ submit }));
vi.mock("@indiecrafts/modules-web-contact/lib/settings", () => ({
  getContactSettings: async () => ({ enabled: flags.enabled }),
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
    new Request("https://x.test/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": site },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
const valid = { email: "a@b.com", message: "Hello", consent: true };

beforeEach(() => {
  flags.contact = true;
  flags.enabled = true;
  submit.mockReset();
});

describe("POST /api/contact", () => {
  it("answers a real and a spam-dropped message alike — 201, same body", async () => {
    for (const result of [{ ok: true }, { ok: false, error: "spam" }]) {
      submit.mockResolvedValueOnce(result);
      const res = await post(valid);
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ ok: true });
    }
  });

  it("consent must be the boolean true; the policy version is the server's", async () => {
    submit.mockResolvedValueOnce({ ok: false, error: "invalid" });
    const res = await post({ ...valid, consent: "true", policyVersion: "forged" });
    expect(res.status).toBe(400);
    expect(submit.mock.calls[0]?.[0]).toMatchObject({ consent: false });
    expect(submit.mock.calls[0]?.[2]).toBe("v1");
  });

  it("an engine failure is a bare 500", async () => {
    submit.mockResolvedValueOnce({ ok: false, error: "server" });
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server" });
  });

  it("the guard refuses cross-site, oversize and malformed bodies before the engine", async () => {
    expect((await post(valid, "cross-site")).status).toBe(403);
    expect((await post({ ...valid, message: "x".repeat(13_000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect(submit).not.toHaveBeenCalled();
  });

  it("is a 404 with the flag off or the Studio toggle off", async () => {
    flags.contact = false;
    expect((await post(valid)).status).toBe(404);
    flags.contact = true;
    flags.enabled = false;
    expect((await post(valid)).status).toBe(404);
    expect(submit).not.toHaveBeenCalled();
  });
});
