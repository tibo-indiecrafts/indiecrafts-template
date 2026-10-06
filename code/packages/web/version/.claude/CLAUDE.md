# `@indiecrafts/packages-web-version` — new-version-shipped reload prompt

Auto-loads under `code/packages/web/version/**`. Tells a visitor a new deploy shipped while their tab
was open, and offers a one-click (or on-next-navigation) reload. i18n-agnostic — copy comes in as
props, so any app reuses it. Consumed by the website + app layouts. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** React 19 · Next (`usePathname`). Deps: web-ui (`Button`) · shared-utils.

- **Exports:** `./version` (the core: `isUpdateAvailable` · `versionId` · `VersionResponse` ·
  `VERSION_ENDPOINT`) · `./use-version-check` (the `"use client"` poll hook; re-exports
  `isUpdateAvailable`) · `./update-prompt` (the self-contained banner).
- **String identity, not semver** — a deploy stamps a new opaque id; equality is the whole test.
- **Detection is a `no-store` poll of `/api/version`** vs the build id baked at build time
  (`build:cf` → `build-info.ts`) — no service worker (OpenNext/Cloudflare). Dev → both the `"dev"` placeholder →
  no false prompt.
- **Explicit per-file exports (no wildcard)** → no tsconfig `paths` entry needed. Never imports an app
  or a module.

Full reference → [`code/docs/packages/web/version.md`](../../../../docs/packages/web/version.md).
