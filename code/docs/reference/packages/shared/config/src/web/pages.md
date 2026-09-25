---
title: "Page config contract"
description: "The generic page-config contract any app's route entries conform to, plus the visibility check."
status: stable
---

# Page config contract

> The shared shape for a page's structural routing and SEO.

## Purpose

Defines the generic page-config contract — the shape any app's route entries conform to — shared so modules (the blog route-gate, llms) can take a `PageConfig` without knowing a specific app's routes. The route data itself is app-owned. A page entry carries only structural routing; SEO content is edited per locale in Sanity.

## Exports

- `Robots` — a local, structural mirror of Next's object-form `Robots` type, keeping this package at zero `next` coupling.
- `RouteSlug` — a plain string or a per-locale slug map.
- `CanonicalOverride`, `OgImageUrl` — a canonical path / URL and an OG image path / URL.
- `PageSeo` — the per-page SEO overrides: title / description / keyword keys, `canonical`, `noindex`, `robots`, `llms`, `openGraph`, `schemaImage`, `structuredData`.
- `PageConfig` — a route entry: `key`, `id`, `slug`, `enabled`, `seo`.
- `isPageVisible(input)` — `true` unless the page explicitly sets `enabled: false`.

## Usage

```ts
import {
  isPageVisible,
  type PageConfig,
} from "@indiecrafts/packages-shared-config/web";

const page: PageConfig = { key: "/about", id: "about", slug: "about" };
if (isPageVisible(page)) {
  // render the route
}
```

## Source

`code/packages/shared/config/src/web/pages.ts`
