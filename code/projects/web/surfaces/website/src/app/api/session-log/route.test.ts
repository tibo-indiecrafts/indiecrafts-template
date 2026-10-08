// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { surface } from "@/config";

const state = vi.hoisted(() => ({ userId: null as string | null }));
const logSession = vi.hoisted(() => vi.fn(async (_input: unknown) => {}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: state.userId, sessionId: state.userId ? "sess_1" : null }),
}));
vi.mock("@indiecrafts/packages-web-auth/session-log", () => ({ logSession }));

const { POST } = await import("./route");
const post = (body: string) =>
  POST(
    new Request("https://x.test/api/session-log", {
      method: "POST",
      headers: { "content-type": "application/json", "cf-ipcountry": "FR" },
      body,
    }),
  );

beforeEach(() => {
  state.userId = null;
  logSession.mockClear();
});

describe("POST /api/session-log", () => {
  it("is a 401 when signed out, and logs nothing", async () => {
    const res = await post("{}");
    expect(res.status).toBe(401);
    expect(await res.text()).toBe("");
    expect(logSession).not.toHaveBeenCalled();
  });

  it("logs the Clerk user + session server-side — 204, empty body", async () => {
    state.userId = "user_123";
    const res = await post(JSON.stringify({ surface: "app" }));
    expect(res.status).toBe(204);
    expect(logSession).toHaveBeenCalledWith(
      expect.objectContaining({
        surface: "app",
        userId: "user_123",
        sessionId: "sess_1",
        country: "FR",
      }),
    );
  });

  it("falls back to this app's surface on a malformed body", async () => {
    state.userId = "user_123";
    expect((await post("{not json")).status).toBe(204);
    expect(logSession).toHaveBeenCalledWith(expect.objectContaining({ surface }));
  });
});
