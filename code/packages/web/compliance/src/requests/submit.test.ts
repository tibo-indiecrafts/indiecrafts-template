import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@indiecrafts/packages-web-email", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  sendEmail: vi.fn(),
}));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings: vi.fn(async () => null),
  pick: () => undefined,
}));

const ok = {
  email: "user@example.com",
  requestType: "erasure",
  consent: true,
  startedAt: 0,
};

beforeEach(() => {
  process.env.API_URL = "https://api.test";
  process.env.APP_API_TOKEN = "tok";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  vi.clearAllMocks();
  delete process.env.API_URL;
  delete process.env.APP_API_TOKEN;
});

describe("submitDataRequest", () => {
  it("posts a bearer-authed request to /v1/data-request and returns ok on 201", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const { submitDataRequest } = await import("./submit");

    const result = await submitDataRequest(
      ok,
      "2026-08-24T00:00:00.000Z",
      "v1",
    );

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.test/v1/data-request");
    expect((init.headers as Record<string, string>).authorization).toBe(
      "Bearer tok",
    );
    expect(JSON.parse(init.body as string)).toMatchObject({
      requestType: "erasure",
      email: "user@example.com",
      policyVersion: "v1",
      submittedAt: "2026-08-24T00:00:00.000Z",
    });
  });

  it("calls notifyOwner (the email brick) on a successful write", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 201 })),
    );
    const { sendEmail } = await import("@indiecrafts/packages-web-email");
    const { getEmailStrings } =
      await import("@indiecrafts/packages-web-email/strings");
    vi.mocked(getEmailStrings).mockResolvedValue({
      dataRequestOwner: {
        enabled: true,
        to: ["dpo@example.com"],
        from: "noreply@example.com",
      },
    } as never);
    process.env.RESEND_API_KEY = "key";
    const { submitDataRequest } = await import("./submit");

    await submitDataRequest(ok, "2026-08-24T00:00:00.000Z");

    expect(sendEmail).toHaveBeenCalledOnce();
    delete process.env.RESEND_API_KEY;
  });

  it('returns {ok:false, error:"server"} on a 500 without calling notifyOwner', async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );
    const { sendEmail } = await import("@indiecrafts/packages-web-email");
    const { submitDataRequest } = await import("./submit");

    const result = await submitDataRequest(ok, "2026-08-24T00:00:00.000Z");

    expect(result).toEqual({ ok: false, error: "server" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('returns {ok:false, error:"server"} when fetch throws', async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const { submitDataRequest } = await import("./submit");

    const result = await submitDataRequest(ok, "2026-08-24T00:00:00.000Z");

    expect(result).toEqual({ ok: false, error: "server" });
  });

  it('returns {ok:false, error:"server"} when API_URL/APP_API_TOKEN are unset, without fetching', async () => {
    delete process.env.API_URL;
    delete process.env.APP_API_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { submitDataRequest } = await import("./submit");

    const result = await submitDataRequest(ok, "2026-08-24T00:00:00.000Z");

    expect(result).toEqual({ ok: false, error: "server" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still runs validation before any network call (invalid email)", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { submitDataRequest } = await import("./submit");

    const result = await submitDataRequest(
      { ...ok, email: "nope" },
      "2026-08-24T00:00:00.000Z",
    );

    expect(result).toEqual({ ok: false, error: "invalid" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
