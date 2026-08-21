# @indiecrafts/hybrid-surfaces-main

The **Electron** desktop app — a native shell (menus · filesystem · tray · auto-update) rendering the
shared web UI, with desktop-only capabilities the browser can't offer.

**Status: active scaffold — it builds.** `pnpm --filter @indiecrafts/hybrid-surfaces-main build` compiles main ·
preload · renderer (electron-vite 5 / vite 7) → `out/` (gitignored). `src/main/index.ts` loads the web
app URL in dev (`RENDERER_URL`, default `:3000`) and the bundled `out/renderer/index.html` when packaged.

- **Renderer** (Chromium/DOM) reuses the web design system — `@indiecrafts/packages-web-ui/web/*`, `ui-components`,
  `ui-tokens`, React 19. The scaffold ships a minimal plain-DOM placeholder; swap in the web UI.
- **Main/preload** (Node) own the desktop surface via a strict `contextBridge` (no `nodeIntegration`).
- **Ship:** code-signed installers (`.dmg` / `.exe` / `AppImage`) via electron-builder; notarize on macOS.

See `.claude/CLAUDE.md`.
