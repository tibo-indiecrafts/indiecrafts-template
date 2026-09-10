# @indiecrafts/packages-shared-system-pages — shared system pages

**Stack:** React 19 (web) · React Native (native) · TypeScript · Tailwind v4 tokens (web) / `ui-tokens/native` (native). The branded status pages every app shares — maintenance · 404 · error · offline — + the maintenance proxy behaviour.

Auto-loads under `code/packages/shared/system-pages/**`. **Forked by platform like `ui-icons`** — `./shared` (contracts + copy) · `./web` (DOM) · `./native` (RN) · `./proxy` (web). **Presentational only** — no Sanity, no fonts, no routes; each app owns those.

- **`./shared`** — the prop **contracts** (`MaintenanceProps` · `NotFoundContentProps` · `ErrorContentProps` · `OfflineContentProps`, copy-only, no React) + **`SHELL_COPY`** (default 404/500/offline copy per locale, the ONE source the non-CMS mobile shell renders so its wording never drifts; the web `website` owns its copy in Sanity, so it doesn't read this).
- **`./web`** — the DOM components. **Next-agnostic**: `NotFoundContent` takes the home link as an **injected** `LinkComponent` (default a plain `<a>`), so the Next website passes its `@/i18n/routing` `Link` while a plain-React host takes the default — **no `next-intl` dep**. `ErrorContent` (`"use client"`) uses `@indiecrafts/packages-web-ui/web/button`.
- **`./native`** — the React Native components (View/Text/Pressable). Same contracts; the app owns nav via `onGoHome`/`onRetry`. **Themed from the shared tokens** (`useColors` → `@indiecrafts/packages-shared-ui-tokens/native`), self-sufficient background so they read in light + dark.
- **`./proxy`** — `maintenanceRewrite(request, isDown)`: the 503 rewrite for an app's `proxy.ts`. **Pure** — the caller decides `isDown` (the app ORs the build-time `features.maintenance` flag with the live Sanity `siteSettings.maintenanceMode` toggle). Returns `null` when not down.

**The split:** the brick owns _how the status pages look_ + _the maintenance behaviour_; each app owns _the copy_ (web: i18n + Sanity `getSystemPages`; shells: `SHELL_COPY` + local `messages`), _the fonts + chrome_, _the routes_, and the tiny `maintenanceLocale()` cookie read. Anything rendering token classes (web) needs its `@source` line in `ui-tokens/globals.css` (done).

Deps: `@indiecrafts/packages-web-ui` (web `Button`) · `@indiecrafts/packages-shared-ui-tokens` (`/native` colours). The 404 home link is injected, so **no `next-intl` dep**. Never imports an app or a module.

Full reference → [`code/docs/packages/system-pages.md`](../../../../docs/packages/system-pages.md).
