# Error &amp; not-found pages

Two failure states have dedicated pages: an uncaught render error and a 404. Each is a **reusable composite** in `src/user-interface/pages/` mounted by a **thin Next.js route file** in `src/app/[locale]/`. All copy comes from `messages/<locale>.json` — nothing is inlined.

## The split

| State          | Composite (`src/user-interface/pages/`) | Route (`src/app/[locale]/`) | Message namespace |
| -------------- | --------------------------------------- | --------------------------- | ----------------- |
| Uncaught error | `Error.tsx`                             | `error.tsx`                 | `pages.error`     |
| 404 not found  | `NotFound.tsx`                          | `not-found.tsx`             | `pages.notFound`  |

The composites own the layout and copy; the route files own the Next.js contract (`error.tsx` must be a Client Component with `error` / `reset` props; `not-found.tsx` renders for unmatched routes and `notFound()` calls).

## Error page

`src/user-interface/pages/Error.tsx` renders inside `DefaultLayout` and reads three keys from `pages.error`:

```tsx
const t = useTranslations("pages.error");
// t("title"), t("description"), t("retryLabel")
```

It takes an `onRetry` callback wired to the retry button, plus optional `header` / `footer` slots (passed straight to `DefaultLayout`, so you can suppress chrome on a hard failure).

The route file `src/app/[locale]/error.tsx` is the Client Component Next mounts on a render error. It logs, then hands `reset` to the composite as `onRetry`:

```tsx
"use client";
export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);
  return <ErrorPage onRetry={reset} />;
}
```

Note the `logger.error(...)` — errors are never swallowed silently.

## Not-found page

`src/user-interface/pages/NotFound.tsx` follows the same shape, reading `pages.notFound`:

```tsx
const t = useTranslations("pages.notFound");
// t("eyebrow"), t("title"), t("description"), t("homeLabel")
```

The "back home" link uses the locale-aware `Link` from `@/i18n/routing` (never `next/link`), so it stays inside the active locale.

The route file is a one-liner that re-exports the composite:

```tsx
import { NotFound as NotFoundPage } from "@/user-interface/pages/NotFound";
export default function NotFound() {
  return <NotFoundPage />;
}
```

## The strings

Both namespaces live in every `messages/<locale>.json`. Defaults (`en.json`):

```jsonc
"pages": {
  "error":    { "title": "Something went wrong", "description": "An unexpected error occurred. Please try again.", "retryLabel": "Try again" },
  "notFound": { "eyebrow": "404", "title": "Page not found", "description": "The page you requested doesn't exist or has moved.", "homeLabel": "← Back home" }
}
```

Translate the same keys in each locale file. Both composites share one centered layout (`max-w-xl`, `px-(--gutter)`, muted description, single action), so they read as one family regardless of which one a visitor hits.

::: tip
There's also a standalone `Maintenance.tsx` composite in `src/user-interface/pages/` for the maintenance route — same "centered composite reading from messages" pattern, mounted outside `[locale]/` with its own root layout.
:::
