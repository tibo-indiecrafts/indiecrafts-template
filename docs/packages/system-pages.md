# System pages (maintenance · 404 · error)

The branded **status pages** every app shares — the maintenance screen, the 404, and the error (500)
boundary — plus the maintenance **proxy behaviour**. Lives in the **`@indiecrafts/system-pages`** brick
(`code/packages/system-pages`), consumed as source. **Presentational only**: no Sanity, no fonts, no
routes — each app owns those.

Extracted so a second app (the platform reserves `admin`/`mobile`/… slots) inherits the same status
pages + maintenance behaviour instead of re-implementing them.

## Exports

| Import | What it is |
| --- | --- |
| `Maintenance` (`.`) | The standalone full-page maintenance screen (own `min-h-dvh`). Props: `statusLabel, title, body, contactLabel, name, email?`. |
| `NotFoundContent` (`.`) | The centered 404 card. Props: `eyebrow, title, description, homeLabel`. Home link via the shared `@indiecrafts/i18n` `Link`. |
| `ErrorContent` (`.`) | The centered 500 card (`"use client"`, `@indiecrafts/ui/web/button`). Props: `title, description, retryLabel, onRetry?`. |
| `maintenanceRewrite(request, isDown)` (`./proxy`) | For an app's `proxy.ts`: returns a `503` rewrite to `/maintenance` when `isDown`, else `null`. **Pure** — the app decides `isDown` (build-time `features.maintenance` OR the live Sanity toggle), so the brick stays Sanity-free. |

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
import { maintenanceRewrite } from "@indiecrafts/system-pages/proxy";
import { getMaintenanceMode } from "@/lib/maintenance";
const res = maintenanceRewrite(request, features.maintenance || (await getMaintenanceMode()));
if (res) return res;
return intlMiddleware(request);
```

Anything rendering token classes needs a `@source` line in `ui-tokens/globals.css` (done for the web
app). Turn maintenance on with the Sanity `siteSettings.maintenanceMode` toggle (live, no deploy) or the
`features.maintenance` hard override — see
[Maintenance mode](../apps/web/setup/maintenance-mode.md).

## Deps

`@indiecrafts/config` (`features`) · `@indiecrafts/i18n` (`Link`) · `@indiecrafts/ui` (`Button`). Peer
`react`/`react-dom`/`next`. Never imports an app or a module.
