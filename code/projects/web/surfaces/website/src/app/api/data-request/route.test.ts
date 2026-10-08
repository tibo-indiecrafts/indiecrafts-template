// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ dataRequest: true }));
const submitDataRequest = vi.hoisted(() => vi.fn());
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      legal: {
        ...real.features.legal,
        get dataRequest() {
          return flags.dataRequest;
        },
      },
    },
  };
});
vi.mock("@indiecrafts/packages-web-compliance/requests/submit", () => ({
  submitDataRequest,
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
    new Request("https://x.test/api/data-request", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": site,
        "cf-connecting-ip": "203.0.113.7",
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
const valid = { email: "a@b.com", requestType: "access", consent: true };

beforeEach(() => {
  flags.dataRequest = true;
  submitDataRequest.mockReset();
});

describe("POST /api/data-request", () => {
  it("answers a stored and a spam-dropped request alike — 201, same body", async () => {
    for (const result of [{ ok: true }, { ok: false, error: "spam" }]) {
      submitDataRequest.mockResolvedValueOnce(result);
      const res = await post(valid);
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ ok: true });
    }
  });

  it("hands the engine the server's policy version and the trusted client IP", async () => {
    submitDataRequest.mockResolvedValueOnce({ ok: true });
    await post({ ...valid, policyVersion: "forged" });
    const [input, , version, ip] = submitDataRequest.mock.calls[0] ?? [];
    expect(input).toMatchObject({
      email: "a@b.com",
      requestType: "access",
      consent: true,
    });
    expect(version).toBe("v1");
    expect(ip).toBe("203.0.113.7");
  });

  it("an invalid request → 400; an engine failure → a bare 500", async () => {
    submitDataRequest
      .mockResolvedValueOnce({ ok: false, error: "invalid" })
      .mockResolvedValueOnce({ ok: false, error: "server" });
    expect((await post({ ...valid, requestType: "hack" })).status).toBe(400);
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server" });
  });

  it("the guard refuses cross-site, oversize and malformed bodies before the engine", async () => {
    expect((await post(valid, "cross-site")).status).toBe(403);
    expect((await post({ ...valid, message: "x".repeat(9000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect(submitDataRequest).not.toHaveBeenCalled();
  });

  it("is a 404 with the flag off", async () => {
    flags.dataRequest = false;
    expect((await post(valid)).status).toBe(404);
    expect(submitDataRequest).not.toHaveBeenCalled();
  });
});
