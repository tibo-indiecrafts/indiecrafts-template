import { app, BrowserWindow, ipcMain, shell } from "electron";
import { join } from "node:path";
import { autoUpdater } from "electron-updater";
import { callAgent } from "@indiecrafts/packages-shared-agent-client";
import { isSafeExternalUrl, parseOAuthCallback } from "./url-guard";
import { defaultLocale, sitePrefix } from "../config";

// Auto-update (packaged builds only). electron-updater checks the `publish` feed from
// electron-builder.yml — the generic Cloudflare R2 URL (`downloads.<root>/hybrid`) — and
// notifies when a newer signed build is available. Guarded so an unreachable/unconfigured
// feed never crashes; dev (unpackaged) never checks (there is no feed to hit).
function checkForUpdates(): void {
  if (!app.isPackaged) return;
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    console.error("update check failed:", err);
  });
}

// Open a URL in the user's real browser (the legal link-out — the renderer builds
// the website legal URL via `legalUrl`, this opens it). Restricted to http(s) so the
// sandboxed renderer can never hand the OS a `file://` or custom-scheme URL.
ipcMain.handle("open-external", (_e, url: string) => {
  if (isSafeExternalUrl(url)) void shell.openExternal(url);
});

// Shared AI agent — the `code/shared/agent` Worker (POST /v1/agent/:name), via the
// shared `@indiecrafts/packages-shared-agent-client` (the fetch + never-throw
// contract lives once, reused by the web + mobile callers). Done in the MAIN
// process so the bearer token stays out of the renderer/DOM. Two origins now: the
// agent Worker (agent:run) and the api Worker (session:log → /v1/events). Set at launch
// (never bundled into the renderer):
//   AGENT_URL   = https://indiecrafts-<env>-shared-agent.<subdomain>.workers.dev
//   API_URL     = https://indiecrafts-<env>-shared-api.<subdomain>.workers.dev
//   AGENT_TOKEN = <the APP_API_TOKEN both workers check>  (a gate, not per-user auth)
const AGENT_URL = process.env.AGENT_URL ?? "http://localhost:8787";
const API_URL = process.env.API_URL ?? "http://localhost:8787";
const AGENT_TOKEN = process.env.AGENT_TOKEN ?? "";

ipcMain.handle(
  "agent:run",
  async (
    _e,
    {
      name,
      context,
      locale,
    }: { name: string; context: string; locale: string },
  ) => {
    if (!AGENT_TOKEN) return { ok: false, error: "missing AGENT_TOKEN" };
    return callAgent(
      name,
      { context, locale },
      { urlPrefix: `${AGENT_URL}/v1/agent`, token: AGENT_TOKEN },
    );
  },
);

// Open the Clerk OAuth authorize URL in the user's real browser (RFC 8252 — never an
// embedded webview, which would expose the provider credentials to the app). https-only
// via the same guard; the OS returns the result to the `indiecrafts://oauth-callback`
// deep link handled at app start below.
ipcMain.handle("oauth:start", (_e, url: string) => {
  if (isSafeExternalUrl(url)) void shell.openExternal(url);
});

// Log a sign-in to the shared api's /v1/events (EU D1 session log). Done in MAIN so the
// bearer token stays out of the renderer/DOM (like agent:run). Fire-and-forget.
ipcMain.handle(
  "session:log",
  async (_e, { userId, sessionId }: { userId: string; sessionId?: string }) => {
    if (!AGENT_TOKEN || typeof userId !== "string" || !userId) return;
    try {
      await fetch(`${API_URL}/v1/events`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${AGENT_TOKEN}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          kind: "session",
          surface: "hybrid",
          userId,
          sessionId,
        }),
      });
    } catch {
      // fire-and-forget
    }
  },
);

// The live window, so the deep-link handlers can forward the OAuth callback to it.
let mainWindow: BrowserWindow | null = null;

// Electron main process. The "hybrid": a native window around the shared web UI. In
// dev, load the `app` product surface (the `/app` dashboard, `:3001`) — the desktop
// app wraps the product, not the marketing website. `RENDERER_URL` stays an explicit
// override (e.g. the `website` at `:3000`, or the bundled renderer dev server). When
// packaged, load the bundled `out/renderer` (see below). The renderer IS Chromium, so
// it reuses the web bricks; the main process (here) uses only the React-free bricks.
const DEV_URL = process.env.RENDERER_URL ?? "http://localhost:3001";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: `${sitePrefix} (${defaultLocale})`,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      // Hardening: isolate the bridge world, run the renderer in the OS sandbox, and
      // keep Node out of the renderer (all default-off, but pinned explicitly). The
      // preload uses only `contextBridge` + `ipcRenderer` + `process.versions`, which
      // stay available under `sandbox`.
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });
  mainWindow = win;
  win.on("closed", () => {
    if (mainWindow === win) mainWindow = null;
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    win.loadURL(DEV_URL);
  }

  // Security: the renderer is our own bundled UI — it must never navigate to another
  // origin or spawn a window. Block cross-origin in-page navigation (a compromised
  // renderer trying to load an attacker page), and route every window.open / target=
  // _blank to the OS browser — http(s) only, never a new Electron window.
  win.webContents.on("will-navigate", (event, url) => {
    try {
      if (new URL(url).origin !== new URL(win.webContents.getURL()).origin) {
        event.preventDefault();
        if (isSafeExternalUrl(url)) void shell.openExternal(url);
      }
    } catch {
      event.preventDefault();
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) void shell.openExternal(url);
    return { action: "deny" };
  });

  // Renderer failed to load (bad bundle, dev server down, offline). The React
  // ErrorBoundary can't help — the bundle never mounted — so paint a minimal,
  // dependency-free error page directly. `errorCode === -3` is an aborted load
  // (e.g. an in-flight navigation replaced it), not a real failure — ignore it.
  win.webContents.on("did-fail-load", (_e, errorCode, errorDescription) => {
    if (errorCode === -3) return;
    void win.loadURL(
      "data:text/html," +
        encodeURIComponent(
          `<!doctype html><meta charset="utf-8"><title>${sitePrefix}</title>` +
            `<body style="font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0;text-align:center">` +
            `<div><h1>Something went wrong</h1><p>The app failed to load (${errorDescription}).</p></div></body>`,
        ),
    );
  });
}

// Deep-link OAuth: register the custom scheme + forward a VALIDATED callback to the
// renderer. A single-instance lock ensures a protocol launch focuses the running app
// instead of spawning a second one (which would break the sign-in handshake).
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.setAsDefaultProtocolClient("indiecrafts");

  // Parse strictly in MAIN, then forward only the allowlisted params over a narrow
  // channel — never a navigable URL. A forged/oversize deep link parses to null → dropped.
  const forwardOAuth = (rawUrl: string | undefined) => {
    const parsed = rawUrl ? parseOAuthCallback(rawUrl) : null;
    if (parsed) mainWindow?.webContents.send("oauth:callback", parsed);
  };

  // macOS delivers the deep link here; Windows/Linux via a second-instance argv.
  app.on("open-url", (event, url) => {
    event.preventDefault();
    forwardOAuth(url);
  });
  app.on("second-instance", (_event, argv) => {
    forwardOAuth(argv.find((a) => a.startsWith("indiecrafts://")));
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    checkForUpdates();
    // Windows/Linux cold start via the protocol: the URL rides the launch argv.
    forwardOAuth(process.argv.find((a) => a.startsWith("indiecrafts://")));
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
