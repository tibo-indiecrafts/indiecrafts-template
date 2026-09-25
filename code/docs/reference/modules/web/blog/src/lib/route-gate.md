---
title: "Blog route gate"
description: "Single source of truth for gating the public blog routes."
status: stable
---

# Blog route gate

> One place that decides whether a blog surface is reachable.

## Purpose

Gates every public blog route behind the `blog` feature flag AND the page entry's `enabled` state, so a new route cannot drift by checking only one half. Sub-surfaces (RSS, comments, search, series, taxonomy) fold in their own flag on top. Taxonomy also reads the editor's Studio toggle, so turning a taxonomy off truly removes its routes, sitemap, and llms entries.

## Exports

- `isBlogRouteEnabled(page)` — the base gate (flag AND page visible).
- `requireBlogRoute(page)` — 404s a page component when the blog is off.
- `isRssEnabled()` — blog reachable AND the `rss` flag.
- `isCommentsEnabled()` — the `blog` flag AND `comments`.
- `isSearchEnabled()` — blog reachable AND `search`.
- `isSeriesEnabled()` — blog reachable AND `series`.
- `isTaxonomyRouteEnabled(kind, page)` — code gate AND the editor's display toggle (async).
- `requireTaxonomyRoute(kind, page)` — 404s a taxonomy page component (async).
- `TaxonomyKind` — `"categories" | "tags" | "authors"`.

## Usage

```ts
import { requireBlogRoute } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { blogPage } from "@indiecrafts/modules-web-blog/lib/config";

requireBlogRoute(blogPage());
```

## Source

`code/modules/web/blog/src/lib/route-gate.ts`
