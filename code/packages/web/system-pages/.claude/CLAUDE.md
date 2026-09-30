# `@indiecrafts/packages-web-system-pages` — shared system pages

**Stack:** React 19 · TypeScript · Tailwind v4 tokens. The branded status pages every app shares — maintenance · 404 · error · offline — + the maintenance proxy behaviour.

Auto-loads under `code/packages/web/system-pages/**`. `./shared` (prop contracts) · `./web` (DOM components) · `./proxy` (the maintenance rewrite). **Presentational only** — no Sanity, no fonts, no routes; each app owns those.

- **`./shared`** — the prop **contracts** (`MaintenanceProps` · `NotFoundContentProps` · `ErrorContentProps` · `OfflineContentProps`, copy-only, no React). Each app passes its own copy (i18n messages, or Sanity on the website).
- **`./web`** — the DOM components. **Next-agnostic**: `NotFoundContent` takes the home link as an **injected** `LinkComponent` (default a plain `<a>`), so the Next website passes its `@/i18n/routing` `Link` while a plain-React host takes the default — **no `next-intl` dep**. `ErrorContent` (`"use client"`) uses `@indiecrafts/packages-web-ui/web/button`.
- **`./proxy`** — `maintenanceRewrite(request, isDown)`: the 503 rewrite for an app's `proxy.ts`. **Pure** — the caller decides `isDown` (the app ORs the build-time `features.maintenance` flag with the live Sanity `siteSettings.maintenanceMode` toggle). Returns `null` when not down.

**The split:** the brick owns _how the status pages look_ + _the maintenance behaviour_; each app owns _the copy_ (i18n messages, plus Sanity `getSystemPages` on the website), _the fonts + chrome_, _the routes_, and the tiny `maintenanceLocale()` cookie read. Anything rendering token classes needs its `@source` line in `ui-tokens/globals.css` (done).

Deps: `@indiecrafts/packages-web-ui` (`Button`). The 404 home link is injected, so **no `next-intl` dep**. Never imports an app or a module.

Full reference → [`code/docs/packages/system-pages.md`](../../../../docs/packages/system-pages.md).
