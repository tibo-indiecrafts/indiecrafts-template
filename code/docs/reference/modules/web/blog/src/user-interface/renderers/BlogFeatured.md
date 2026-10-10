---
title: "Featured renderer"
description: "Block showing curated or auto-flagged featured posts, on any page or in a sidebar."
status: stable
---

# Featured renderer

> Maps pinned or `featured`-flagged posts onto the generic `FeaturedPosts` primitive.

## Purpose

`BlogFeatured` renders the "Featured" block on any page. It works in two modes: curated (`source === "pinned"`, the editor's picks in order) or automatic (`source === "flag"`, the latest posts marked `featured`). It fetches with `blogFeaturedQuery`: `limit` posts (default 4), capped at `EDITORIAL_MAX` in the `editorial` layout. It restores the manual pin order with `reorderByIds`, and maps each post with `toPostCard`. It passes `layout` (`grid` or `editorial`), `eyebrow`, `title`, `intro` and `anchor` to `FeaturedPosts`. A `viewAll` label adds a link to `/blog`. The first card renders as a lead when `leadCard` is on or the layout is `editorial`. With `compact` (in a sidebar), it renders a `PostLinks` list instead. It returns `null` when no post matches.

## Exports

- `BlogFeatured` — async server component; takes `module` (`BlogFeaturedModule`), `locale` (`Locale`), and optional `compact` (boolean).

## Usage

```tsx
import { BlogFeatured } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogFeatured";

<BlogFeatured module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogFeatured.tsx`
