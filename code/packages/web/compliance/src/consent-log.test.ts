import { afterEach, describe, expect, it, vi } from "vitest";

describe("logConsent forwarder", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
    delete process.env.API_URL;
    delete process.env.APP_API_TOKEN;
  });

  it("forwards a consent decision to the api with the bearer + kind:consent", async () => {
    process.env.API_URL = "https://api.test";
    process.env.APP_API_TOKEN = "tok";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const { logConsent } = await import("./consent-log");

    await logConsent({
      userId: "user_x",
      consentId: null,
      events: [{ type: "cookie_analytics", granted: true }],
      version: "2026-01",
      source: "banner",
      surface: "website",
      country: "FR",
      decisionId: "d9",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.test/v1/events");
    expect((init.headers as Record<string, string>).authorization).toBe(
      "Bearer tok",
    );
    expect(JSON.parse(init.body as string)).toMatchObject({
      kind: "consent",
      userId: "user_x",
      policyVersion: "2026-01",
      surface: "website",
      country: "FR",
      decisionId: "d9",
      events: [{ type: "cookie_analytics", granted: true }],
    });
  });

  it("no-ops when API_URL/APP_API_TOKEN are unset", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { logConsent } = await import("./consent-log");
    await logConsent({
      userId: null,
      consentId: "anon",
      events: [{ type: "cookie_analytics", granted: true }],
      version: "v",
      surface: "website",
      decisionId: "d",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
