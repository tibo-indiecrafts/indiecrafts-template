# @indiecrafts/desktop

A cross-platform **desktop app** (Electron — the "hybrid": a native shell around web
UI). A **separate platform**, not a Cloudflare Worker. **Scaffold**: main + preload +
builder config; finalize the bundler, then `pnpm install`.

```bash
pnpm --filter @indiecrafts/desktop dev         # electron-vite dev
pnpm --filter @indiecrafts/desktop dist:mac    # electron-builder → release/*.dmg
```

**Not** in `pnpm deploy:all` — desktop ships **installers** (`.dmg`/`.exe`/`.AppImage`)
via electron-builder (code-sign + notarize). The **renderer** reuses the web bricks
(it's Chromium); the **main** process uses React-free bricks. See `.claude/CLAUDE.md`.
