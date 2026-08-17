# @indiecrafts/hybrid — desktop app (Electron, the "hybrid")

Auto-loads under `code/projects/hybrid/**`. A **separate platform** — a cross-platform desktop app on
**Electron** (Chromium renderer + Node main). NOT a Cloudflare Worker. The "hybrid": a native shell
around the shared web UI.

**Stack:** Electron 33 · **electron-vite 5** (bundler, vite 7) · electron-builder (packaging) ·
TypeScript. The bundler is **wired + building**: `pnpm --filter @indiecrafts/hybrid build` compiles the
three processes to `out/{main,preload,renderer}` (gitignored). `src/main/index.ts` loads the web app URL
in dev (`RENDERER_URL`, default `:3000`) and the bundled `out/renderer/index.html` when packaged.
**Still to finalize per product:** code-signing + notarization (to ship `.dmg`/`.exe`), and whether the
packaged renderer bundles its own UI (current placeholder) or points at the live web build.

## How it differs from the web apps (read this first)

- **Deploy ≠ wrangler.** `electron-builder` packages installers (`.dmg` / `.exe` / `.AppImage`);
  distribution needs **code-signing + notarization**. It is **NOT** in `pnpm deploy:all` (Cloudflare-only).
- **Two runtimes.** `src/main/` is **Node** (window lifecycle, native APIs) — reuse React-free bricks
  only. `src/renderer/` is **Chromium/DOM** — it CAN reuse the web bricks (`@indiecrafts/ui`,
  `ui-components`, `ui-tokens`, React 19), same as a web app. `src/preload/` is the **only** bridge; keep
  `contextIsolation` on and expose a minimal explicit API.
- **The renderer** typically loads a web app (`marketing`/`web`) — dev server in dev, a bundled build or
  the live URL in prod. So "hybrid" = the web UI in a desktop shell.

## Run

```bash
pnpm --filter @indiecrafts/hybrid dev        # electron-vite dev
pnpm --filter @indiecrafts/hybrid build      # → out/{main,preload,renderer}
pnpm --filter @indiecrafts/hybrid dist:mac   # → release/*.dmg (sign + notarize to ship)
```

## Rules

- Compose web bricks in the renderer; **no cross-app imports**; never expose Node APIs to the renderer —
  everything through the preload bridge. Never disable `contextIsolation`; keep a strict CSP in the
  renderer.
