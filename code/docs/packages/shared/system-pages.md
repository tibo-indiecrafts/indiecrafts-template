---
title: "System pages (maintenance · 404 · error)"
description: "The branded status pages every app shares — the maintenance screen, the 404, and the error (500) boundary — plus the maintenance proxy behaviour."
status: stable
---

# System pages (maintenance · 404 · error)

The branded **status pages** every app shares — the maintenance screen, the 404, and the error (500)
boundary — plus the maintenance **proxy behaviour**. Lives in the **`@indiecrafts/packages-shared-system-pages`** brick
(`code/packages/shared/system-pages`), consumed as source. **Presentational only**: no Sanity, no fonts, no
routes — each app owns those.

Extracted so a second app (the platform reserves `admin`/`mobile`/… slots) inherits the same status
pages + maintenance behaviour instead of re-implementing them.

## Exports — forked by platform (like `ui-icons`)

`./shared` = the prop **contracts** (`MaintenanceProps` · `NotFoundContentProps` · `ErrorContentProps` ·
`OfflineContentProps` — copy only, no React) **+ `SHELL_COPY`** (default 404/500/offline copy per locale —
the one source the non-CMS shells render). `./web` = the DOM components (**Next-agnostic** — the 404 home link is injected, so
they serve the **Next website AND a plain-React host**). `./native` = React Native components
(same contracts; **themed from `ui-tokens/native`** so they read in light + dark; the app owns nav via
`onGoHome`/`onRetry`). `./proxy` (web-only) = `maintenanceRewrite`.

**`SHELL_COPY`** (`./shared`) is the shared default status-page copy (`{ notFound, error }` per locale)
that the **mobile** shell merges into its `react-intl` messages, so its wording never drifts.
The **website owns its copy in Sanity** (`getSystemPages`) + its own `messages`, so it does **not** read
`SHELL_COPY` — that keeps status copy editor-editable on the marketing site while the app shells share one
static default.

| Import                                            | What it is                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Maintenance` (`./web`, `./native`)               | The standalone full-page maintenance screen (own `min-h-dvh`). Props: `statusLabel, title, body, contactLabel, name, email?`.                                                                                                                                                                                                                                                                            |
| `NotFoundContent` (`.`)                           | The centered 404 card. Props: `eyebrow, title, description, homeLabel`, + **`LinkComponent?`/`homeHref?`** — the home link is **injected** (default a plain `<a>`). The website passes its `@/i18n/routing` `Link`; a plain-React host uses the default. This keeps the brick **Next-agnostic** (no `next-intl` dep), so the same component serves Next + plain React.                                   |
| `ErrorContent` (`.`)                              | The centered 500 card (`"use client"`, `@indiecrafts/packages-web-ui/web/button`). Props: `title, description, retryLabel, onRetry?`.                                                                                                                                                                                                                                                                    |
| `OfflineContent` (`./web`, `./native`)            | The centered offline card — for a route/screen that cannot render without the network (a non-blocking banner covers the common case; the app owns it). Props: `title, description, retryLabel, onRetry?`. Same shape as `ErrorContent`; distinct so copy + intent stay separate. `SHELL_COPY.offline` adds a short `banner` string too.                                                                  |
| `useOnlineStatus()` (`./web`)                     | Hook — `true` while the browser reports a connection, tracked via `useSyncExternalStore` on the `online`/`offline` events. Hydration-safe: the server snapshot is `true` (never flash offline during SSR); the client reads real `navigator.onLine` on hydration. A coarse signal (a captive portal reads "online"); pair with a failed request for certainty.                                           |
| `OfflineBanner` (`./web`, `./native`)             | A slim, non-blocking strip shown while offline, auto-hiding on reconnect. `role="status"`/`aria-live="polite"` (web), `accessibilityLiveRegion="polite"` (native). **Web** self-detects via `useOnlineStatus` — props: `{ message }`. **Native** takes connectivity as a prop (the app owns detection, e.g. NetInfo) — props: `{ message, online }`. Shared by the website, `app`, and the mobile shell. |
| `maintenanceRewrite(request, isDown)` (`./proxy`) | For an app's `proxy.ts`: returns a `503` rewrite to `/maintenance` when `isDown`, else `null`. **Pure** — the app decides `isDown` (build-time `features.maintenance` OR the live Sanity toggle), so the brick stays Sanity-free.                                                                                                                                                                        |

## The split (brick vs app)

The brick owns **how the status pages look** + **the maintenance behaviour**. Each app owns the rest:

- **Routes** — `app/maintenance/{layout,page}.tsx`, `app/[locale]/{not-found,error}.tsx`.
- **Copy** — `getSystemPages(locale)` (Sanity `siteMeta.<locale>.systemPages`) **`??`** the
  `messages/<locale>.json` fallback (the error page uses messages only — it must render when Sanity is
  what's down).
- **Chrome + fonts** — the maintenance route's own root layout (`@/lib/fonts`); the 404/error routes
  wrap `NotFoundContent`/`ErrorContent` in the app's `DefaultLayout`.
- **`maintenanceLocale()`** — the 4-line `NEXT_LOCALE` cookie read (the maintenance route lives outside
  `[locale]`, so it reads the cookie directly).

## Wiring an app

```ts
// proxy.ts
import { features } from "@/config";
import { maintenanceRewrite } from "@indiecrafts/packages-shared-system-pages/proxy";
import { getMaintenanceMode } from "@/lib/maintenance";
const res = maintenanceRewrite(
  request,
  features.maintenance || (await getMaintenanceMode()),
);
if (res) return res;
return intlMiddleware(request);
```

Anything rendering token classes needs a `@source` line in `ui-tokens/globals.css` (done for the web
app). Turn maintenance on with the Sanity `siteSettings.maintenanceMode` toggle (live, no deploy) or the
`features.maintenance` hard override — see
[Maintenance mode](/projects/web/website/setup/maintenance-mode).

## Deps

`@indiecrafts/packages-shared-config` (`features`) · `@indiecrafts/packages-web-ui` (`Button`; the 404 home link is injected, so **no `next-intl` dep**). Peer
`react`/`react-dom`/`next`. Never imports an app or a module.
