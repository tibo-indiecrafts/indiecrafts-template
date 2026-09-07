import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth } = vi.hoisted(() => ({ auth: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth }));

const { logSession } = vi.hoisted(() => ({ logSession: vi.fn() }));
vi.mock("@indiecrafts/packages-web-auth/session-log", () => ({ logSession }));

const { POST } = await import("./route");

function request(init: { body?: object; headers?: Record<string, string> } = {}) {
  return new Request("https://x.dev/api/session-log", {
    method: "POST",
    ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
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
    const res = await POST(request({ body: { surface: "app" } }));
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
    });
  });

  it("forwards a caller-supplied surface and the cf-ipcountry header", async () => {
    auth.mockResolvedValue({ userId: "user_2", sessionId: "sess_2" });
    const res = await POST(
      request({ body: { surface: "app" }, headers: { "cf-ipcountry": "FR" } }),
    );
    expect(res.status).toBe(204);
    expect(logSession).toHaveBeenCalledWith({
      surface: "app",
      userId: "user_2",
      sessionId: "sess_2",
      country: "FR",
    });
  });
});
