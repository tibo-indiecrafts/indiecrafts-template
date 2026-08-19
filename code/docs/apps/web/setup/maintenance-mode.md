# Maintenance mode

Maintenance takes the whole public site offline behind a branded "we'll be back" page — while the Studio and crawler-facing metadata stay up. Use it for planned downtime (a risky content migration, a DNS cutover) without deploying a separate holding page.

**Two ways to trigger it — a live toggle and a hard override:**

|                               | Where                                                           | Effect                                      | Use for                                   |
| ----------------------------- | --------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------- |
| **Live toggle** (recommended) | Sanity → **Paramètres du site → Indexation → Mode maintenance** | Flips on within ~1 minute, **no redeploy**  | Ops flipping the site off/on              |
| **Hard override**             | `features.maintenance` in `apps/web/src/config/features.ts`     | On at build time, **skips the Sanity read** | Forcing maintenance during a known deploy |

The proxy trips on **either** (`features.maintenance || getMaintenanceMode()`). It lives in six places: the Sanity `siteSettings.maintenanceMode` field, the cached reader `getMaintenanceMode()` (`src/lib/maintenance.ts`), the `features.maintenance` flag, the rewrite in `src/proxy.ts` (via `maintenanceRewrite` from **[`@indiecrafts/system-pages`](/packages/system-pages)**), the standalone `/maintenance` route, and the shared `Maintenance` component.

---

## 1. Turn it on

**Live (no deploy) — the usual way:** in the Studio, open **Paramètres du site → Indexation → Mode maintenance** and switch it on. The proxy reads it from Sanity's CDN with a ~30s per-isolate cache, so it takes effect within a minute. Switch it off to bring the site back — again, no deploy.

**Hard override (build-time):** set `features.maintenance: true` in `apps/web/src/config/features.ts`, commit, redeploy. This forces maintenance **and skips the Sanity read entirely** — handy when you're deploying and know the site is down. Set back to `false` to re-enable the live toggle.

---

## 2. What happens when it's on

`src/proxy.ts` resolves `isDown` (the hard override OR the live Sanity toggle) and hands it to `maintenanceRewrite`, which rewrites every matched request to `/maintenance` and answers HTTP **503** with `Retry-After: 3600`:

```ts
// src/proxy.ts
import { features } from "@indiecrafts/config";
import { maintenanceRewrite } from "@indiecrafts/system-pages/proxy";
import { getMaintenanceMode } from "@/lib/maintenance";

const isDown = features.maintenance || (await getMaintenanceMode()); // || short-circuits the Sanity read
const maintenance = maintenanceRewrite(request, isDown); // 503 rewrite, or null when up
if (maintenance) return maintenance;
return intlMiddleware(request);
```

`getMaintenanceMode()` reads `siteSettings.maintenanceMode` from Sanity's **CDN** endpoint (public field, no token), cached in-memory per isolate (~30s). It's **fail-open** — any error → not in maintenance, so a Sanity hiccup never 503s the whole site. `maintenanceRewrite` itself is now **pure** (`(request, isDown)`); the app owns the decision, the brick stays Sanity-free.

- The rewrite is **invisible to the URL bar** — visitors keep the URL they asked for, they just get the maintenance page.
- **503** tells crawlers the outage is temporary, so Google doesn't drop your pages from the index; `Retry-After` hints when to come back.
- The `!pathname.startsWith("/maintenance")` guard stops the rewrite looping on itself.

::: tip
503 is the correct status for planned downtime — it preserves ranking. A maintenance page served as 200 would tell Google your real content is now "we'll be back", which is exactly what you don't want.
:::

### What stays reachable

The proxy `matcher` excludes these paths, so maintenance never touches them:

```text
api · _next · _vercel · studio · maintenance ·
manifest · robots · sitemap ·
and any path with a file extension (.css, .png, …)
```

So while the public site is dark, **`/studio` keeps working** (editors prep content through the outage) and **`robots.txt`, `sitemap.xml`, and the manifest/icon routes stay live** (crawlers still resolve metadata).

Note the LLM and blog-feed endpoints (`/llms.txt`, `/llms-full.txt`, `/llms/<id>`, `/blog/rss.xml`, `/blog/<slug>/md`) are explicitly re-added to the matcher for locale rewriting, so they **are** matched — they go dark with the rest of the public site.

---

## 3. The standalone route

`/maintenance` sits **outside** the `[locale]/` segment — same pattern as `/studio`. next-intl's locale routing never runs for it, so the route owns its own root layout.

```text
src/app/maintenance/
├── layout.tsx    Own <html>/<body> — imports @indiecrafts/ui-tokens/globals.css + @/lib/fonts
├── page.tsx      Resolves i18n + Sanity copy, renders <Maintenance>
└── locale.ts     Best-effort locale from the NEXT_LOCALE cookie
```

- **`layout.tsx`** owns its own `<html lang>` / `<body>` (it can't inherit the `[locale]` layout). It pulls in the site fonts via `@/lib/fonts` (`fontClassName` + `fontStyle`) and sets `colorScheme: "light dark"`. **No `ThemeProvider`** — dark mode falls to the `prefers-color-scheme` tokens in `globals.css`, which is all a static page needs.
- **`locale.ts`** exports `maintenanceLocale()`. Because the route lives outside `[locale]`, it reads next-intl's `NEXT_LOCALE` cookie directly and falls back to `defaultLocale`. That drives `<html lang>` and the copy language.
- **`page.tsx`** sets the `<title>` from the maintenance copy and forces `robots: { index: false, follow: false }`, then renders `<Maintenance>`.

---

## 4. Where the strings come from

Copy is resolved **per field** from Sanity `siteMeta.<locale>.systemPages.maintenance` (via `getSystemPages`) **`??` the `messages/<locale>.json` fallback**. A failure page must never depend on Sanity being up, so the bundled copy always backs it — blank a Sanity field and the message default shows. Edit the Sanity fields in the Studio (SEO & métadonnées → per-language → system pages → maintenance).

The fallback lives under `pages.maintenance` in every `messages/<locale>.json`:

```jsonc
// messages/en.json
"pages": {
  "maintenance": {
    "status": "Scheduled maintenance",   // status pill
    "title": "…",                        // <h1> + <title>
    "body": "…",
    "contact": "…"                       // label before the email link
  }
}
```

Keep the same keys in every locale file, translated. Two values come from Sanity `siteSettings` rather than the maintenance copy:

- **Contact email** — `business.contactPoint.email`, rendered as a `mailto:` link. It's optional; the contact line only renders if an email is set.
- **Footer wordmark** — `siteName` (falls back to `DEFAULT_SITE_NAME`).

---

## 5. The page itself

The `Maintenance` component (`@indiecrafts/system-pages`) is purely presentational — the route resolves the copy + identity and passes them as props (`statusLabel`, `title`, `body`, `contactLabel`, `name`, optional `email`). It renders a centered card: a status pill with a pulsing brand dot, the headline, the body, the optional `mailto:` line, and `name` pinned at the bottom. It's token-based, so a second app gets the same page in its own theme.

The pulsing dot is an honest "actively working" signal, not decoration — and the page's only motion, so it holds still under `prefers-reduced-motion` (`motion-reduce:hidden` on the ping layer).

---

## 6. Verify

Either flip `siteSettings.maintenanceMode` on in the Studio (wait up to ~30s for the cache) **or** set `features.maintenance: true` locally, then:

```bash
pnpm dev

# Public page returns 503 + the maintenance markup
curl -sI http://localhost:3000/en | grep -iE "http/|retry-after"
# → HTTP/1.1 503 Service Unavailable
# → retry-after: 3600

# Studio still reachable
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/studio      # → 200

# robots.txt still resolves
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/robots.txt  # → 200
```

Flip the Sanity toggle (or the flag) back off to bring the site back.
