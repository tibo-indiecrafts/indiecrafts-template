---
title: "Route table"
description: "Turns the config pages map into the ROUTES array and PATHNAMES table."
status: stable
---

# Route table

> The production route table derived from the `pages` config map.

## Purpose

This file turns the `pages` map from `@/config` into the shapes that routing and the sitemap consume. `ROUTES` is the array of every static route; `PATHNAMES` merges each route's key and slug with the dynamic URL patterns (`/blog/[slug]`, `/author/[slug]`, and the like). Adding a static route is one entry in the `pages` map — this file needs no change.

## Exports

- `ROUTES` — readonly `AppRoute[]`; every static route from the `pages` map.
- `PATHNAMES` — record of route key to slug, including dynamic patterns; consumed by `i18n/routing.ts` and `sitemap.ts`.

## Usage

```ts
import { ROUTES, PATHNAMES } from "@/app/routes";

for (const route of ROUTES) {
  // route.key, route.id, route.slug
}
```

## Source

`code/projects/web/surfaces/website/src/app/routes.ts`
