---
title: "Featured posts module"
description: "Page-builder block that shows one large lead post followed by a grid or a list of featured posts, on any page."
status: stable
---

# Featured posts module

> A large lead post plus a grid or a list of featured posts.

## Purpose

Defines the `module.blog-featured` page-builder block. It can sit on any page, to promote the blog. A `layout` radio picks `grid` (lead card + grid, the default) or `editorial` (lead card + list, the home page's strip). Optional `eyebrow`, `intro` and `viewAll` (the label of a link to the blog) frame the block; an empty field hides its part. A `source` radio chooses between auto-updating posts flagged `featured` (`flag`) and a fixed `pinned` selection. A `limit` (an integer, 1–20, default 4) caps the count. The `editorial` layout shows 4 posts at most, so a higher `limit` there gets a warning. `leadCard` (default on) renders the first post large; the `editorial` layout hides it, because that layout always leads. The pinned picker is hidden unless the source is `pinned` and is filtered to the document language.

## Exports

- `default` — the `module.blog-featured` schema definition (built via `defineModule`).

## Usage

```ts
import blogFeatured from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-featured";
// Registered in schema/modules/index.ts; rendered by BlogFeatured (FeaturedPosts, or PostLinks in a sidebar).
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-featured.ts`
