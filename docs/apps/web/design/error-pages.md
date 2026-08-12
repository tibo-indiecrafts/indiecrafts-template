# Error &amp; not-found pages

Three failure states each get a dedicated page: an uncaught render error (500), a
404, and site-wide maintenance. Every one is a **presentational composite** in
`src/user-interface/<state>/components/` mounted by a **thin route file**. No copy
is inlined — but where it comes from differs by state, and that difference is the
whole design.

## The split

| State | Composite | Route | Copy source |
| --- | --- | --- | --- |
| Uncaught error (500) | `error/components/Error.tsx` | `app/[locale]/error.tsx` | `messages` only (`pages.error`) |
| 404 not found | `not-found/components/NotFound.tsx` | `app/[locale]/not-found.tsx` | Sanity `systemPages.notFound` ?? `messages` (`pages.notFound`) |
| Maintenance (503) | `maintenance/components/Maintenance.tsx` | `app/maintenance/` (via `proxy.ts`) | i18n + Sanity brand |

The composites own layout; the route files own the Next.js contract and resolve
the copy. All three share one centered layout (`max-w-xl`/`max-w-md`,
`px-(--gutter)`, muted description, single action) so they read as one family.

## Why error copy is `messages`, not Sanity

The 404 and maintenance pages pull copy from Sanity (with a `messages` fallback),
because their routes can `await` a server fetch. The **500 page can't** — `error.tsx`
is a Next.js *client* error boundary. It has no async server phase, and it must
render even when Sanity is the thing that broke. Keeping its copy on bundled
`messages` guarantees the 500 page never depends on the failure it's reporting.

## Error page (500)

`error/components/Error.tsx` is a `"use client"` component that renders inside
`DefaultLayout` and reads `pages.error` directly:

```tsx
const t = useTranslations("pages.error");
// t("title") · t("description") · t("retryLabel")
```

It takes an `onRetry` callback (wired to the retry `Button` from
`@indiecrafts/ui/button`) plus optional `header` / `footer` slots — pass `false`
to suppress chrome on a hard failure. The route hands Next's `reset` in as
`onRetry` and logs first:

```tsx
"use client";
import { logger } from "@indiecrafts/utils";

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);
  return <Error onRetry={reset} />;
}
```

The `logger.error(...)` is non-negotiable — errors are never swallowed.

## Not-found page (404)

`not-found/components/NotFound.tsx` is **purely presentational** — it takes
`eyebrow`, `title`, `description`, `homeLabel` as props (plus the same optional
`header`/`footer` slots). The route resolves them, Sanity-first with a `messages`
fallback, so the page still renders when Sanity is down:

```tsx
const [sys, t] = await Promise.all([
  getSystemPages(locale),                                  // @/lib/system-pages
  getTranslations({ locale, namespace: "pages.notFound" }),
]);
const nf = sys.notFound ?? {};
return (
  <NotFound
    eyebrow={nf.eyebrow ?? t("eyebrow")}
    title={nf.title ?? t("title")}
    description={nf.description ?? t("description")}
    homeLabel={nf.homeLabel ?? t("homeLabel")}
  />
);
```

The route also exports `metadata = { robots: { index: false, follow: false } }` —
belt-and-suspenders over the 404 status. The "back home" link uses the locale-aware
`Link` from `@/i18n/routing` (never `next/link`), so it stays inside the active locale.

## Maintenance page (503)

`maintenance/components/Maintenance.tsx` is the standalone `/maintenance` route,
served when `features.maintenance` is on — `proxy.ts` rewrites all traffic to it
with a 503. It sits **outside** `[locale]/` with its own root layout. Also
props-driven: the route resolves copy via i18n and the brand identity (name +
contact email) from Sanity and passes them in. Its one motion — the pulsing status
dot — is an honest "actively working" signal, and holds still under
`prefers-reduced-motion` (`motion-reduce:hidden` on the ping).

## The strings

`pages.error` and `pages.notFound` live in every `messages/<locale>.json`. Defaults
(`en.json`):

```jsonc
"pages": {
  "error":    { "title": "Something went wrong", "description": "An unexpected error occurred. Please try again.", "retryLabel": "Try again" },
  "notFound": { "eyebrow": "404", "title": "Page not found", "description": "The page you requested doesn't exist or has moved.", "homeLabel": "← Back home" }
}
```

Translate the same keys per locale. The 404 and maintenance copy can additionally
be overridden per-locale in Sanity (`siteMeta.<locale>.systemPages`) — the
`messages` values are the fallback, so a fresh install works before any editing.
