# @indiecrafts/packages-web-version — new-version-shipped reload prompt

Auto-loads under `code/packages/web/version/**`. Tells a visitor a new deploy shipped while their tab
was open, and offers a one-click (or on-next-navigation) reload. i18n-agnostic — copy comes in as
props, so any app reuses it. Consumed by the website layout. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** React 19 · Next (`usePathname`). Deps: web-ui (`Button`) · shared-utils · shared-version.

- **Exports:** `./use-version-check` (the `"use client"` poll hook) · `./update-prompt` (the
  self-contained banner). `isUpdateAvailable` is re-exported here from `packages-shared-version` (the
  portable string-identity compare the hook uses).
- **Detection is a `no-store` poll of `/api/version`** vs the build id baked at build time
  (`build:cf` → `build-info.ts`) — no service worker (OpenNext/Cloudflare). Dev → both `"unknown"` →
  no false prompt.
- **Explicit per-file exports (no wildcard)** → no tsconfig `paths` entry needed. Never imports an app
  or a module.

Full reference → [`code/docs/packages/version.md`](../../../../docs/packages/version.md).
