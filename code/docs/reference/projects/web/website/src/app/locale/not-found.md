---
title: "Not-found page"
description: "Localized 404 page with Sanity-driven copy and a bundled fallback."
status: stable
---

# Not-found page

> The `[locale]/not-found.tsx` — the branded 404 page for the locale segment.

## Purpose

Next.js not-found component for the locale segment. It renders `NotFoundContent` (from `@indiecrafts/packages-shared-system-pages`) inside `DefaultLayout`, with each field taken from Sanity (`siteMeta.<locale>.systemPages.notFound`) and falling back to `messages.pages.notFound` so the page still renders when Sanity is down. It is marked `robots: { index: false, follow: false }`.

## Exports

- `metadata` — no-index robots metadata.
- `NotFound` (default) — the async server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/not-found.tsx`
