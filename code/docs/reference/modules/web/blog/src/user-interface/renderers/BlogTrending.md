---
title: "Trending renderer"
description: "Frontpage block showing the most popular posts, falling back to most recent."
status: stable
---

# Trending renderer

> Merges pinned and popular (or recent) posts up to a shared cap, on `SpotlightRow`.

## Purpose

`BlogTrending` renders the frontpage "Trending" block. It reads the most popular post ids from `getPopularPostIds`, which returns most-recent while there is no read-count source (see `lib/popularity.ts`). The editor's `pinned` posts take precedence, and trending or recent posts fill the rest up to the shared `count` cap via `mergePinnedWithFallback`. The block always renders content once any post exists. It maps onto the generic `SpotlightRow` primitive with no "view all" link.

## Exports

- `BlogTrending` — async server component; takes `module` (`BlogTrendingModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogTrending } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogTrending";

<BlogTrending module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogTrending.tsx`
