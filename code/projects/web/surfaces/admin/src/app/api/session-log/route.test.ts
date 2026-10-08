// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth } = vi.hoisted(() => ({ auth: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth }));

const { logSession } = vi.hoisted(() => ({ logSession: vi.fn() }));
vi.mock("@indiecrafts/packages-web-auth/session-log", () => ({ logSession }));

const { POST } = await import("./route");

function request(init: { body?: object | string; headers?: Record<string, string> } = {}) {
  const body =
    init.body === undefined
      ? {}
      : { body: typeof init.body === "string" ? init.body : JSON.stringify(init.body) };
  return new Request("https://x.dev/api/session-log", {
    method: "POST",
    ...body,
    headers: init.headers,
  });
}

beforeEach(() => {
  auth.mockReset();
  logSession.mockReset();
  logSession.mockResolvedValue(undefined);
});

describe("POST /api/session-log", () => {
  it("401s when the caller isn't signed in and never logs", async () => {
    auth.mockResolvedValue({ userId: null, sessionId: null });
    const res = await POST(request({ body: { surface: "admin" } }));
    expect(res.status).toBe(401);
    expect(logSession).not.toHaveBeenCalled();
  });

  it("falls back to the 'web' surface when the body is missing or malformed", async () => {
    auth.mockResolvedValue({ userId: "user_1", sessionId: "sess_1" });
    const res = await POST(request());
    expect(res.status).toBe(204);
    expect(logSession).toHaveBeenCalledWith({
      surface: "web",
      userId: "user_1",
      sessionId: "sess_1",
      country: null,
      clientIp: "unknown",
    });
  });

  it("forwards a caller-supplied surface, the cf-ipcountry header and the visitor IP", async () => {
    auth.mockResolvedValue({ userId: "user_2", sessionId: "sess_2" });
    const res = await POST(
      request({
        body: { surface: "admin" },
        headers: { "cf-ipcountry": "FR", "cf-connecting-ip": "203.0.113.9" },
      }),
    );
    expect(res.status).toBe(204);
    expect(logSession).toHaveBeenCalledWith({
      surface: "admin",
      userId: "user_2",
      sessionId: "sess_2",
      country: "FR",
      clientIp: "203.0.113.9",
    });
  });

  it("answers 204 for invalid JSON and a non-string surface, logging 'web'", async () => {
    auth.mockResolvedValue({ userId: "user_3", sessionId: "sess_3" });
    for (const body of ["{not json", { surface: 42 }, { surface: ["admin"] }]) {
      expect((await POST(request({ body }))).status, JSON.stringify(body)).toBe(204);
    }
    expect(logSession).toHaveBeenCalledTimes(3);
    for (const [input] of logSession.mock.calls) expect(input.surface).toBe("web");
  });

  it("never reads the body for a signed-out caller", async () => {
    auth.mockResolvedValue({ userId: null, sessionId: null });
    const req = request({ body: { surface: "admin" } });
    expect((await POST(req)).status).toBe(401);
    expect(req.bodyUsed).toBe(false);
  });
});
