# Maintenance mode

A single flag that takes the whole public site offline behind a branded "we'll be back" page — while the Studio and crawler-facing metadata routes stay up. Use it for planned downtime (a risky content migration, a DNS cutover) without deploying a separate holding page.

Everything lives in three places: the `features.maintenance` flag in `src/config/index.ts`, the rewrite in `src/proxy.ts`, and the standalone `/maintenance` route under `src/app/maintenance/`.

---

## 1. Turn it on

```ts
// src/config/index.ts
features = {
  // …
  maintenance: true, // was false
};
```

It's a **build-time flag**, not an env var — flip it, commit, and redeploy (or restart `pnpm dev` locally). Set it back to `false` and redeploy to bring the site back.

---

## 2. What happens when it's on

`src/proxy.ts` rewrites every matched public request to `/maintenance` and answers with an HTTP **503** plus a `Retry-After: 3600` header:

```ts
// src/proxy.ts
if (features.maintenance && !request.nextUrl.pathname.startsWith("/maintenance")) {
  return NextResponse.rewrite(new URL("/maintenance", request.url), {
    status: 503,
    headers: { "Retry-After": "3600" },
  });
}
```

- The rewrite is **invisible to the URL bar** — visitors keep the URL they asked for, they just get the maintenance page.
- The `503` tells crawlers the outage is **temporary**, so Google doesn't drop your pages from the index. `Retry-After` hints when to come back.
- The `!pathname.startsWith("/maintenance")` guard stops the rewrite from looping back on itself.

::: tip
`503` is the correct status for planned downtime — it preserves your search ranking. A maintenance page served as `200` would tell Google your real content is now "we'll be back", which is exactly what you don't want.
:::

### What stays reachable

The proxy `matcher` already excludes a set of paths, so maintenance mode never touches them:

```
api · _next · _vercel · studio · maintenance ·
manifest · robots · sitemap ·
and any path with a file extension (.css, .png, …)
```

So while the public site is dark:

- **`/studio` keeps working** — editors can prep content through the outage.
- **`robots.txt`, `sitemap.xml`, and the icon / OG / manifest routes stay live** — crawlers still resolve site metadata.

---

## 3. The standalone route

`/maintenance` sits **outside** the `[locale]/` segment — same pattern as `/studio`. next-intl's locale routing never runs for it, so the route owns its own root layout.

```
src/app/maintenance/
├── layout.tsx    Own <html>/<body> — imports globals.css + @/lib/fonts
├── page.tsx      Resolves i18n copy, renders <Maintenance>
└── locale.ts     Best-effort locale from the NEXT_LOCALE cookie
```

- **`layout.tsx`** owns its own `<html lang>` / `<body>` (it can't inherit the `[locale]` layout). It pulls in the site fonts via `@/lib/fonts` (`fontClassName` + `fontStyle`) and sets `colorScheme: "light dark"`. There's **no `ThemeProvider`** — dark mode falls to the `prefers-color-scheme` tokens in `globals.css`, which is all a single static page needs.
- **`locale.ts`** exports `maintenanceLocale()`. Because the route lives outside `[locale]`, it reads next-intl's `NEXT_LOCALE` cookie directly and falls back to `defaultLocale`. That drives `<html lang>` and which translation the copy comes from.
- **`page.tsx`** sets the `<title>` from `pages.maintenance.title` and forces `robots: { index: false, follow: false }`, then renders `<Maintenance>` with the four translated strings.

---

## 4. Where the strings come from

**Editable in Sanity** (Studio → SEO & métadonnées → SEO par langue → **Pages
système → Page de maintenance**), per language. Each field reads Sanity **`??` the
`messages/<locale>.json` fallback** below — a failure page must never depend on
Sanity being up, so the bundled copy always backs it. Blank a Sanity field → the
message default shows.

The fallback copy lives under `pages.maintenance` in every `messages/<locale>.json`:

```jsonc
// messages/en.json
"pages": {
  "maintenance": {
    "status": "Scheduled maintenance",              // status pill
    "title": "We'll be back shortly",               // <h1> + <title>
    "body": "The site is briefly offline for planned updates. …",
    "contact": "Need to reach us in the meantime?"  // label before the email link
  }
}
```

Edit these to change the message — keep the same keys in `fr.json` (and every other locale), translated.

Two values come from config rather than messages:

- The **contact email** is `site.contact.email` — the page renders it as a `mailto:` link.
- The **footer wordmark** is `site.name`.

---

## 5. The page itself

`src/user-interface/maintenance/components/Maintenance.tsx` is purely presentational — the route resolves the copy and passes it in as props (`statusLabel`, `title`, `body`, `contactLabel`). It renders a centered card: a status pill with a pulsing brand dot, the headline, the body, and the `mailto:` contact line, with `site.name` pinned at the bottom.

The pulsing dot is an honest "actively working" signal, not decoration — and it's the page's only motion, so it holds still under `prefers-reduced-motion` (`motion-reduce:hidden` on the ping layer).

---

## 6. Verify

With `features.maintenance: true` locally:

```bash
pnpm dev

# Public page returns 503 and the maintenance markup
curl -sI http://localhost:3000/en | grep -iE "http/|retry-after"
# → HTTP/1.1 503 Service Unavailable
# → retry-after: 3600

# Studio is still reachable
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/studio       # → 200

# robots.txt still resolves
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/robots.txt   # → 200
```

Remember to flip the flag back to `false` before your normal production deploy.
