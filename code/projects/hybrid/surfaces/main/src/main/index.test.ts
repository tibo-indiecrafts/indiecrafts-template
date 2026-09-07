import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { callAgent as CallAgentFn } from "@indiecrafts/packages-shared-agent-client";

/**
 * Covers the IPC handler LOGIC registered in `./index.ts` — not the window/lifecycle
 * code (needs a real Electron harness, see the report below). `electron` is mocked so
 * importing the module is side-effect-free: `ipcMain.handle` captures each handler into
 * `handlers` instead of registering with a real IPC bus, and `app.whenReady()` returns a
 * promise that never resolves so `createWindow()` (which needs a real `BrowserWindow`)
 * never runs. `url-guard` is NOT mocked — `open-external`/`oauth:start` are exercised
 * through the real `isSafeExternalUrl` guard.
 *
 * `index.ts` reads `AGENT_TOKEN`/`AGENT_URL`/`API_URL` from `process.env` into
 * module-level consts AT IMPORT TIME (not per-call), so the two `AGENT_TOKEN` states
 * each need their own fresh module load — `vi.resetModules()` + reimport per describe,
 * with the env var set beforehand.
 */
const { handlers, openExternal } = vi.hoisted(() => ({
  handlers: new Map<string, (event: unknown, ...args: unknown[]) => unknown>(),
  openExternal: vi.fn(),
}));

vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn(
      (
        channel: string,
        fn: (event: unknown, ...args: unknown[]) => unknown,
      ) => {
        handlers.set(channel, fn);
      },
    ),
  },
  shell: { openExternal },
  app: {
    isPackaged: false,
    requestSingleInstanceLock: vi.fn(() => true),
    setAsDefaultProtocolClient: vi.fn(),
    // Never resolves — createWindow()/checkForUpdates() (need a real BrowserWindow)
    // deliberately never run in this suite.
    whenReady: vi.fn(() => new Promise(() => {})),
    on: vi.fn(),
    quit: vi.fn(),
  },
  BrowserWindow: class {
    static getAllWindows() {
      return [];
    }
  },
}));

vi.mock("electron-updater", () => ({
  autoUpdater: { checkForUpdatesAndNotify: vi.fn(() => Promise.resolve()) },
}));

vi.mock("@indiecrafts/packages-shared-agent-client", () => ({
  callAgent: vi.fn(),
}));

const call = (channel: string, ...args: unknown[]) => {
  const fn = handlers.get(channel);
  if (!fn) throw new Error(`no handler registered for "${channel}"`);
  return fn(null, ...args);
};

describe("with AGENT_TOKEN set", () => {
  let callAgent: typeof CallAgentFn;

  beforeAll(async () => {
    process.env.AGENT_TOKEN = "test-token";
    vi.resetModules();
    ({ callAgent } = await import("@indiecrafts/packages-shared-agent-client"));
    await import("./index");
    // Cold transform of index.ts's full import graph (electron-updater, the agent
    // client, config) is slow on a first run — past the default 10s hook timeout.
  }, 30000);

  it("open-external opens a safe http(s) URL", () => {
    call("open-external", "https://indiecrafts.dev/legal/terms");
    expect(openExternal).toHaveBeenCalledWith(
      "https://indiecrafts.dev/legal/terms",
    );
  });

  it("open-external refuses an unsafe URL — does NOT call shell.openExternal", () => {
    openExternal.mockClear();
    call("open-external", "file:///etc/passwd");
    call("open-external", "javascript:alert(1)");
    expect(openExternal).not.toHaveBeenCalled();
  });

  it("oauth:start opens a safe authorize URL", () => {
    openExternal.mockClear();
    call("oauth:start", "https://clerk.example.com/oauth/authorize");
    expect(openExternal).toHaveBeenCalledWith(
      "https://clerk.example.com/oauth/authorize",
    );
  });

  it("oauth:start refuses a non-http(s) URL", () => {
    openExternal.mockClear();
    call("oauth:start", "data:text/html,<script>");
    expect(openExternal).not.toHaveBeenCalled();
  });

  it("agent:run forwards name/context/locale to callAgent and returns its result", async () => {
    vi.mocked(callAgent).mockResolvedValueOnce({
      ok: true,
      data: { text: "hi" },
    });

    const result = await call("agent:run", {
      name: "content-research",
      context: "some input",
      locale: "fr",
    });

    expect(callAgent).toHaveBeenCalledWith(
      "content-research",
      { context: "some input", locale: "fr" },
      expect.objectContaining({ token: "test-token" }),
    );
    expect(result).toEqual({ ok: true, data: { text: "hi" } });
  });

  describe("session:log", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("posts a session event with bearer auth", async () => {
      const fetchMock = vi.fn(() =>
        Promise.resolve(new Response(null, { status: 200 })),
      );
      vi.stubGlobal("fetch", fetchMock);

      await call("session:log", { userId: "user-1", sessionId: "sess-1" });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/v1/events"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            authorization: "Bearer test-token",
          }),
          body: JSON.stringify({
            kind: "session",
            surface: "hybrid",
            userId: "user-1",
            sessionId: "sess-1",
          }),
        }),
      );
    });

    it("does nothing without a userId — never calls fetch", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      await call("session:log", { userId: "" });

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});

describe("without AGENT_TOKEN", () => {
  let callAgent: typeof CallAgentFn;

  beforeAll(async () => {
    delete process.env.AGENT_TOKEN;
    vi.resetModules();
    ({ callAgent } = await import("@indiecrafts/packages-shared-agent-client"));
    await import("./index");
  }, 30000);

  it("agent:run fails closed — never calls callAgent", async () => {
    // `callAgent`'s mock is the same singleton across both describes (vi.resetModules
    // does not reset an already-mocked module) — clear the prior describe's call history.
    vi.mocked(callAgent).mockClear();

    const result = await call("agent:run", {
      name: "content-research",
      context: "some input",
      locale: "en",
    });

    expect(callAgent).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false, error: "missing AGENT_TOKEN" });
  });

  it("session:log does nothing — never calls fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await call("session:log", { userId: "user-1" });

    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
