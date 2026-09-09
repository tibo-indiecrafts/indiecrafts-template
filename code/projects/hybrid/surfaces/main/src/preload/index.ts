import { contextBridge, ipcRenderer } from "electron";

// Preload — the ONLY bridge between the sandboxed renderer and Node. Expose a
// minimal, explicit API (never the whole `ipcRenderer`); keep contextIsolation on.
contextBridge.exposeInMainWorld("desktop", {
  version: process.versions.electron,
  // Run the shared AI agent. The fetch + the bearer token happen in the MAIN
  // process (see src/main), so the token never enters the renderer/DOM.
  runAgent: (name: string, context: string, locale: string) =>
    ipcRenderer.invoke("agent:run", { name, context, locale }),
  // Open a URL in the user's real browser (the legal link-out to the website).
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
  // Open the Clerk OAuth authorize URL in the OS browser (main-process shell.openExternal).
  startOAuth: (url: string) => ipcRenderer.invoke("oauth:start", url),
  // Log a sign-in to the audit api (main-process fetch; the token stays out of the DOM).
  logSignIn: (userId: string, sessionId?: string) =>
    ipcRenderer.invoke("session:log", { userId, sessionId }),
  // Read / write the caller's marketing-email opt-in via the api. The renderer's strict
  // CSP blocks a direct api fetch, so MAIN makes it — the endpoint is Clerk-JWT auth'd, so
  // the renderer passes its own session token (not the app bearer). get → boolean|null.
  marketingConsentGet: (token: string): Promise<boolean | null> =>
    ipcRenderer.invoke("marketing:get", { token }),
  marketingConsentSet: (
    token: string,
    granted: boolean,
    surface: string,
  ): Promise<{ ok: boolean }> =>
    ipcRenderer.invoke("marketing:set", { token, granted, surface }),
  // Subscribe to the VALIDATED OAuth callback params forwarded from main; returns an
  // unsubscribe. Only the parsed `{ state, rotatingTokenNonce }` crosses — never a URL.
  onOAuthCallback: (
    handler: (data: { state: string; rotatingTokenNonce?: string }) => void,
  ) => {
    const listener = (
      _e: unknown,
      data: { state: string; rotatingTokenNonce?: string },
    ) => handler(data);
    ipcRenderer.on("oauth:callback", listener);
    return () => ipcRenderer.removeListener("oauth:callback", listener);
  },
});
