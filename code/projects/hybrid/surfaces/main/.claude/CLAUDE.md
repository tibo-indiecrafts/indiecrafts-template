# @indiecrafts/hybrid-surfaces-main — desktop app (Electron, the "hybrid")

Auto-loads under `code/projects/hybrid/**`. A **separate platform** — a cross-platform desktop app on
**Electron** (Chromium renderer + Node main). NOT a Cloudflare Worker. The "hybrid": a native shell
around the shared web UI.

**Stack:** Electron 33 · **electron-vite 5** (bundler, vite 7) · electron-builder (packaging) ·
TypeScript. The bundler is **wired + building**: `pnpm --filter @indiecrafts/hybrid-surfaces-main build` compiles the
three processes to `out/{main,preload,renderer}` (gitignored). `src/main/index.ts` loads the web app URL
in dev (`RENDERER_URL`, default `:3001` — the `app` product surface, not the marketing website) and the
bundled `out/renderer/index.html` when packaged.
**The renderer bundles its own UI.** `src/renderer/src/main.tsx` mounts a real **React 19** app (Vite +
`@vitejs/plugin-react` + `@tailwindcss/vite`) that reuses the web shadcn brick (`@indiecrafts/packages-web-ui`)
and the Next-agnostic `system-pages/web` (404/500 via an injected `<a>`), themed by `ui-tokens` (`data-theme`
toggle) + `react-intl` (locale from `navigator.language`), wrapped in a TanStack `QueryClientProvider`
(shared `queryDefaults` from `packages-shared-query`; the renderer `queryFn` is the `window.desktop.runAgent`
preload bridge, so the api-client call stays in the main process). The main process shows a dependency-free error
page on renderer `did-fail-load`. **Shell overlays** (`src/renderer/src/shell.tsx`): the shared
`compliance/web` consent banner + legal re-acceptance popup (`localStorage` store, gated by
`config.features.requireConsent`, off by default; **geo-targeted** per country via the api `GET /v1/geo`
+ `config.consent` — renderer `geo.ts`), a version prompt polling the website's `/api/version`
(forked to drop `usePathname`; renderer reload applies), a legal link-out (`shell.openExternal` via the
`open-external` ipc), and a first-run locale suggestion. Instance config (`sitePrefix` · `websiteUrl` ·
`buildId` · `features` · `policyVersion`) in `src/config/index.ts`. **Still to finalize per product:**
code-signing + notarization (to ship `.dmg`/`.exe`); native desktop auto-update (`electron-updater`) is a
follow-up; full offline website parity (blog/page-builder) is out of scope — that would mean embedding
Next in Electron. Model → [`cross-platform-shell.md`](../../../../../docs/shared/architecture/cross-platform-shell.md).

## How it differs from the web apps (read this first)

- **Deploy ≠ wrangler.** `electron-builder` packages installers (`.dmg` / `.exe` / `.AppImage`);
  distribution needs **code-signing + notarization**. **Platform class:** `electron` — deploy via
  `pnpm deploy:hybrid:main:<dev|staging|prod>` → `shared/scripts/deploy/electron.mjs` (builds the host-OS installer via
  `dist:<os>`). Outside the **default** `pnpm deploy:all` (Cloudflare-only), but reached by
  `pnpm deploy:all:<env> --only all`. Signing/notarizing + publishing are follow-ups. Registry +
  deploy model → [`scripts/lib/apps.mjs`](../../../../../shared/scripts/lib/apps.mjs) ·
  [`code/docs/shared/architecture/platform-deploy.md`](../../../../../docs/shared/architecture/platform-deploy.md).
- **Two runtimes.** `src/main/` is **Node** (window lifecycle, native APIs) — reuse React-free bricks
  only. `src/renderer/` is **Chromium/DOM** — it CAN reuse the web bricks (`@indiecrafts/packages-web-ui`,
  `ui-components`, `ui-tokens`, React 19), same as a web app. `src/preload/` is the **only** bridge; keep
  `contextIsolation` on and expose a minimal explicit API.
- **The renderer** bundles its own React 19 shell (reuses the web bricks) when packaged; in dev it can
  still point at the `website` dev server (`RENDERER_URL`). So "hybrid" = the shared web UI in a desktop shell.

## Run

```bash
pnpm --filter @indiecrafts/hybrid-surfaces-main dev        # electron-vite dev
pnpm --filter @indiecrafts/hybrid-surfaces-main build      # → out/{main,preload,renderer}
pnpm --filter @indiecrafts/hybrid-surfaces-main dist:mac   # → release/*.dmg (sign + notarize to ship)
```

## Rules

- Compose web bricks in the renderer; **no cross-app imports**; never expose Node APIs to the renderer —
  everything through the preload bridge. **Never weaken the window security posture:** keep
  `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`; keep the `will-navigate` +
  `setWindowOpenHandler` allowlist (the renderer never navigates cross-origin or spawns a window — external
  `http(s)` links open in the OS browser); keep a strict CSP. Route every OS-bound URL through
  `isSafeExternalUrl` (`src/main/url-guard.ts`) — `http(s)` only, never `file:`/`javascript:`/`data:`.
