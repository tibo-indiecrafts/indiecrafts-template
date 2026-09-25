---
title: "Featured renderer"
description: "Frontpage block showing curated or auto-flagged featured posts."
status: stable
---

# Featured renderer

> Maps pinned or `featured`-flagged posts onto the generic `FeaturedPosts` primitive.

## Purpose

`BlogFeatured` renders the frontpage "Featured" block. It works in two modes: curated (`source === "pinned"`, the editor's picks in order) or automatic (`source === "flag"`, the latest posts marked `featured`). It fetches with `blogFeaturedQuery`, restores the manual pin order with `reorderByIds`, and shapes the results into `PostCardItem[]`. With `leadCard` on, the first card renders as a lead. It returns `null` when no post matches.

## Exports

- `BlogFeatured` — async server component; takes `module` (`BlogFeaturedModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogFeatured } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogFeatured";

<BlogFeatured module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogFeatured.tsx`
