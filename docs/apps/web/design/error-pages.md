# Error &amp; not-found pages

Three failure states each get a dedicated page: an uncaught render error (500), a
404, and site-wide maintenance. Each is a **presentational component** in the shared
**[`@indiecrafts/system-pages`](/packages/system-pages)** brick, mounted by a **thin
route file** in the app. No copy is inlined — but where it comes from differs by
state, and that difference is the whole design.

## The split

| State | Component (`@indiecrafts/system-pages`) | Route (app) | Copy source |
| --- | --- | --- | --- |
| Uncaught error (500) | `ErrorContent` | `app/[locale]/error.tsx` | `messages` only (`pages.error`) |
| 404 not found | `NotFoundContent` | `app/[locale]/not-found.tsx` | Sanity `systemPages.notFound` ?? `messages` (`pages.notFound`) |
| Maintenance (503) | `Maintenance` | `app/maintenance/` (via `proxy.ts`) | i18n + Sanity brand |

The brick components are **presentational and token-based** (so a second app inherits
the same pages in its own theme); the app route files own the Next.js contract,
**resolve the copy**, and **wrap the chrome**. `ErrorContent` + `NotFoundContent` are
the centered inner card only — the route wraps them in the site `DefaultLayout`.
`Maintenance` is the full standalone page (its own root layout). All three share one
centered layout (`max-w-xl`/`max-w-md`, `px-(--gutter)`, muted description, single
action) so they read as one family.

## Why error copy is `messages`, not Sanity

The 404 and maintenance pages pull copy from Sanity (with a `messages` fallback),
because their routes can `await` a server fetch. The **500 page can't** — `error.tsx`
is a Next.js *client* error boundary. It has no async server phase, and it must
render even when Sanity is the thing that broke. Keeping its copy on bundled
`messages` guarantees the 500 page never depends on the failure it's reporting.

## Error page (500)

`ErrorContent` is a `"use client"` component that takes copy as **props**
(`title`, `description`, `retryLabel`) plus an `onRetry` callback (wired to the retry
`Button` from `@indiecrafts/ui/web/button`). The app's `error.tsx` boundary reads
`pages.error`, hands Next's `reset` in as `onRetry`, wraps it in `DefaultLayout`, and
logs first:

```tsx
"use client";
import { useTranslations } from "next-intl";
import { ErrorContent } from "@indiecrafts/system-pages";
import { logger } from "@indiecrafts/utils";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

export default function ErrorBoundary({ error, reset }: Props) {
  const t = useTranslations("pages.error");
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);
  return (
    <DefaultLayout>
      <ErrorContent title={t("title")} description={t("description")} retryLabel={t("retryLabel")} onRetry={reset} />
    </DefaultLayout>
  );
}
```

The `logger.error(...)` is non-negotiable — errors are never swallowed.

## Not-found page (404)

`NotFoundContent` is **purely presentational** — it takes `eyebrow`, `title`,
`description`, `homeLabel` as props. The route resolves them, Sanity-first with a
`messages` fallback, so the page still renders when Sanity is down, and wraps the
card in `DefaultLayout`:

```tsx
const [sys, t] = await Promise.all([
  getSystemPages(locale),                                  // @/lib/system-pages
  getTranslations({ locale, namespace: "pages.notFound" }),
]);
const nf = sys.notFound ?? {};
return (
  <DefaultLayout>
    <NotFoundContent
      eyebrow={nf.eyebrow ?? t("eyebrow")}
      title={nf.title ?? t("title")}
      description={nf.description ?? t("description")}
      homeLabel={nf.homeLabel ?? t("homeLabel")}
    />
  </DefaultLayout>
);
```

The route also exports `metadata = { robots: { index: false, follow: false } }` —
belt-and-suspenders over the 404 status. The "back home" link uses the locale-aware
`Link` from **`@indiecrafts/i18n`** (the shared navigation, never `next/link`), so it
stays inside the active locale.

## Maintenance page (503)

`Maintenance` is the full standalone page served at `/maintenance` when
`features.maintenance` is on — `proxy.ts` rewrites all traffic to it with a 503 (via
`maintenanceRewrite` from `@indiecrafts/system-pages/proxy`). The route sits
**outside** `[locale]/` with its own root layout (the app fonts). Also props-driven:
the route resolves copy via i18n and the brand identity (name + contact email) from
Sanity and passes them in. Its one motion — the pulsing status dot — is an honest
"actively working" signal, and holds still under `prefers-reduced-motion`
(`motion-reduce:hidden` on the ping). Full runbook: [Maintenance mode](../setup/maintenance-mode.md).

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
