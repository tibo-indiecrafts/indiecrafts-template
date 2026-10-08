// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  userId: null as string | null,
  anonymous: false,
  jar: new Map<string, { value: string; opts?: Record<string, unknown> }>(),
}));
const logConsent = vi.hoisted(() => vi.fn(async (_input: unknown) => {}));
vi.mock("@clerk/nextjs/server", () => ({ auth: async () => ({ userId: state.userId }) }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => state.jar.get(k),
    set: (k: string, value: string, opts?: Record<string, unknown>) =>
      state.jar.set(k, { value, opts }),
  }),
  headers: async () => new Headers({ "cf-ipcountry": "FR" }),
}));
vi.mock("@indiecrafts/packages-shared-compliance/server/consent-log", () => ({
  logConsent,
}));
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      compliance: {
        get logAnonymousConsent() {
          return state.anonymous;
        },
      },
    },
  };
});

const { POST } = await import("./route");
const post = (body: unknown) =>
  POST(
    new Request("https://x.test/api/consent-log", {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.7" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
const valid = {
  events: [{ type: "analytics", granted: true }],
  version: "v1",
  decisionId: "d1",
};

beforeEach(() => {
  state.userId = null;
  state.anonymous = false;
  state.jar.clear();
  logConsent.mockClear();
});

describe("POST /api/consent-log", () => {
  it("logs a signed-in decision under the Clerk user — never a user id from the body", async () => {
    state.userId = "user_123";
    const res = await post({ ...valid, userId: "user_forged" });
    expect(res.status).toBe(204);
    expect(logConsent).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user_123",
        consentId: null,
        country: "FR",
        clientIp: "203.0.113.7",
      }),
    );
    expect(state.jar.size).toBe(0);
  });

  it("drops an anonymous decision (204, nothing logged) while the flag is off", async () => {
    expect((await post(valid)).status).toBe(204);
    expect(logConsent).not.toHaveBeenCalled();
  });

  it("with the flag on, keys an anonymous decision by an httpOnly consent_id cookie", async () => {
    state.anonymous = true;
    expect((await post(valid)).status).toBe(204);
    const cookie = state.jar.get("consent_id");
    expect(cookie?.opts).toMatchObject({ httpOnly: true, secure: true });
    expect(logConsent).toHaveBeenCalledWith(
      expect.objectContaining({ userId: null, consentId: cookie?.value }),
    );
  });

  it("rejects an oversize body (413) and a malformed one (400) before logging", async () => {
    state.userId = "user_123";
    expect((await post({ ...valid, source: "x".repeat(4000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ version: "v1", decisionId: "d1" })).status).toBe(400);
    expect(logConsent).not.toHaveBeenCalled();
  });
});
