# @indiecrafts/desktop — desktop app (Electron, the "hybrid")

Auto-loads under `code/apps/desktop/**`. A **separate platform** — a cross-platform desktop app on **Electron** (Chromium renderer + Node main). NOT a Cloudflare Worker. The "hybrid": a native shell around web UI.

**Stack:** Electron · electron-vite (bundler) · electron-builder (packaging) · TypeScript. **Scaffold — finalize the bundler + signing on `pnpm install`.**

## How it differs from the web apps (read this first)

- **Deploy ≠ wrangler.** `electron-builder` packages installers (`.dmg` / `.exe` / `.AppImage`); distribution needs **code-signing + notarization**. It is **NOT** in `pnpm deploy:all` (Cloudflare-only).
- **Two runtimes.** `src/main/` is **Node** (window lifecycle, native APIs) — reuse React-free bricks only. `src/renderer/` is **Chromium/DOM** — it CAN reuse the web bricks (`@indiecrafts/ui`, `ui-components`, `ui-tokens`, React 19), same as a web app. `src/preload/` is the **only** bridge; keep `contextIsolation` on and expose a minimal explicit API.
- **The renderer** typically loads a web app (`marketing`/`web`) — dev server in dev, a bundled build or the live URL in prod. So "hybrid" = the web UI in a desktop shell.

## Deploy

```bash
pnpm --filter @indiecrafts/desktop dev        # electron-vite dev
pnpm --filter @indiecrafts/desktop dist:mac   # → release/*.dmg (sign + notarize to ship)
```

## Pointers

- Multi-app model → [`docs/shared/architecture/multi-app.md`](../../../../docs/shared/architecture/multi-app.md).
- Security: never disable `contextIsolation`, never expose `ipcRenderer` wholesale.
