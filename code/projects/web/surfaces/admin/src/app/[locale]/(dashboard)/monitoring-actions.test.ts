import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Admin actions on erasures + the cron: every path (1) fails closed for a non-admin —
// no api call, no audit — and (2) calls the right bearer-gated api route, audited.
// Same `vi.hoisted` + dynamic-import convention as actions.test.ts.
const { authMock, auditMock, fetchMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  auditMock: vi.fn(async () => undefined),
  fetchMock: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock }));
vi.mock("@/lib/audit", () => ({ audit: auditMock }));
vi.stubGlobal("fetch", fetchMock);

const { retryErasure, closeErasure, runCronNow } = await import("./monitoring-actions");

const admin = { userId: "user_admin1", sessionClaims: { metadata: { role: "admin" } } };
const nonAdmin = { userId: "user_bob1", sessionClaims: { metadata: {} } };
const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

beforeEach(() => {
  vi.stubEnv("API_URL", "http://api.test");
  vi.stubEnv("APP_API_TOKEN", "tok");
});
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe.each([
  ["retryErasure", () => retryErasure(7)],
  ["closeErasure", () => closeErasure(7, "erased by hand")],
  ["runCronNow", () => runCronNow()],
])("%s — non-admin", (_name, call) => {
  it("fails closed: forbidden, no api call, no audit", async () => {
    authMock.mockResolvedValue(nonAdmin);
    expect(await call()).toEqual({ ok: false, error: "forbidden" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });
});

describe("retryErasure", () => {
  it("POSTs the retry with the bearer (and the typed email when given) and audits", async () => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(reply(200, { ok: true }));
    expect(await retryErasure(7, " subject@x.com ")).toEqual({ ok: true, outcome: "completed" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/v1/erasure-requests/7/retry",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ authorization: "Bearer tok" }),
        body: JSON.stringify({ email: "subject@x.com" }),
      }),
    );
    expect(auditMock).toHaveBeenCalledWith("admin.erasure_retry", { actor: "user_admin1", target: "erasure:7" });
  });

  it.each([
    [207, { ok: true, partial: true }, { ok: true, outcome: "partial" }],
    [502, { ok: false, clerk_failed: true }, { ok: false, error: "clerk_failed" }],
    [422, { error: "email_required" }, { ok: false, error: "email_required" }],
    [400, { error: "email_mismatch" }, { ok: false, error: "email_mismatch" }],
    [409, { error: "not_retryable" }, { ok: false, error: "not_retryable" }],
    [409, { error: "clerk_email_changed" }, { ok: false, error: "clerk_email_changed" }],
    [503, { error: "clerk_unavailable" }, { ok: false, error: "clerk_unavailable" }],
    [503, { error: "unavailable" }, { ok: false, error: "unavailable" }],
    [409, { error: "changed" }, { ok: false, error: "changed" }],
  ])("maps a %s reply", async (status, body, expected) => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(reply(status, body));
    expect(await retryErasure(7)).toEqual(expected);
  });

  it("rejects a bad id before calling the api", async () => {
    authMock.mockResolvedValue(admin);
    expect(await retryErasure(-1)).toEqual({ ok: false, error: "invalid" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("closeErasure", () => {
  it("sends the note and the admin id, and audits", async () => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(reply(200, { ok: true }));
    expect(await closeErasure(7, "  erased by hand  ")).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/v1/erasure-requests/7/close",
      expect.objectContaining({ body: JSON.stringify({ note: "erased by hand", by: "user_admin1" }) }),
    );
    expect(auditMock).toHaveBeenCalledWith("admin.erasure_close", { actor: "user_admin1", target: "erasure:7" });
  });

  it("rejects a too-short note without calling the api", async () => {
    authMock.mockResolvedValue(admin);
    expect(await closeErasure(7, "  ok ")).toEqual({ ok: false, error: "note_required" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("runCronNow", () => {
  it("POSTs /v1/cron/run, audits, and reports the run status", async () => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(reply(500, { status: "failed", passes: [] }));
    expect(await runCronNow()).toEqual({ ok: true, status: "failed" });
    expect(fetchMock).toHaveBeenCalledWith("http://api.test/v1/cron/run", expect.objectContaining({ method: "POST" }));
    expect(auditMock).toHaveBeenCalledWith("admin.cron_run", { actor: "user_admin1", target: "cron" });
  });

  it.each(["cron_unbound", "cron_unreachable"])("reports %s", async (error) => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(reply(error === "cron_unbound" ? 503 : 502, { error }));
    expect(await runCronNow()).toEqual({ ok: false, error });
  });

  it("reports unreachable when the api is not configured", async () => {
    authMock.mockResolvedValue(admin);
    vi.stubEnv("API_URL", "");
    expect(await runCronNow()).toEqual({ ok: false, error: "unreachable" });
    // Same rule as retry/close: every authorized attempt is audited, reached or not.
    expect(auditMock).toHaveBeenCalledWith("admin.cron_run", { actor: "user_admin1", target: "cron" });
  });
});
