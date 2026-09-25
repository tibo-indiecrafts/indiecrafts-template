---
title: "Studio page"
description: "Mounts the embedded Sanity Studio under a catch-all route."
status: stable
---

# Studio page

> The catch-all route that renders the embedded Sanity Studio at `/studio`.

## Purpose

`StudioPage` mounts the embedded Sanity Studio. The catch-all `[[...tool]]` segment lets the Studio's internal routing work, and it renders a client wrapper from `@/sanity/Studio` because the Studio bundle uses client-only React APIs. The route sits outside `[locale]/` so it is never localized, and it is gated by `features.studio` — off means the whole Studio 404s while the public site is untouched.

## Exports

- `dynamic` — the route segment config, set to `"force-static"`.
- `metadata`, `viewport` — re-exported from `next-sanity/studio`.
- `default` (`StudioPage`) — server component; renders the Studio, or calls `notFound()` when the flag is off.

## Source

`code/projects/web/surfaces/website/src/app/studio/[[...tool]]/page.studio.tsx`
