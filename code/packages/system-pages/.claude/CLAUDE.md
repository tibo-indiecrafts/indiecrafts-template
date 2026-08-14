# @indiecrafts/system-pages — shared system pages

**Stack:** React 19 · TypeScript · Tailwind v4 (tokens) · next-intl. The branded status pages every app shares — maintenance · 404 · error — + the maintenance proxy behaviour.

Auto-loads under `code/packages/system-pages/**`. Consumed as source via `transpilePackages`. **Presentational only** — no Sanity, no fonts, no routes; each app owns those.

- **`@indiecrafts/system-pages`** (`.`) — the three **props-only, token-based** components:
  - `Maintenance` — the standalone full-page maintenance screen (own `min-h-dvh`; the app's `/maintenance` route wraps it in a root layout with the app fonts).
  - `NotFoundContent` — the centered 404 card (uses the shared `@indiecrafts/i18n` `Link`). The app's `not-found.tsx` resolves copy + wraps it in the site chrome (`DefaultLayout`).
  - `ErrorContent` — the centered 500 card (`"use client"`, `@indiecrafts/ui/button`). The app's client `error.tsx` boundary resolves copy (bundled messages, never Sanity) + wraps it.
- **`@indiecrafts/system-pages/proxy`** — `maintenanceRewrite(request, isDown)`: the 503 rewrite for an app's `proxy.ts`. **Pure** — the caller decides `isDown` (the app ORs the build-time `features.maintenance` flag with the live Sanity `siteSettings.maintenanceMode` toggle). Returns `null` when not down (caller continues to next-intl).

**The split:** the brick owns *how the status pages look* + *the maintenance behaviour*; each app owns *the copy* (i18n + Sanity `getSystemPages`), *the fonts + `DefaultLayout` chrome*, *the routes*, and the tiny `maintenanceLocale()` cookie read. Anything rendering token classes needs its `@source` line in `ui-tokens/globals.css` (done).

Deps: `@indiecrafts/config` · `@indiecrafts/i18n` · `@indiecrafts/ui`. Never imports an app or a module.
