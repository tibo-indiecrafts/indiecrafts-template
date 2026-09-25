---
title: "Featured posts module"
description: "Page-builder block that shows one large lead post followed by a grid of featured posts."
status: stable
---

# Featured posts module

> A large lead post plus a grid of featured posts.

## Purpose

Defines the `module.blog-featured` page-builder block. A `source` radio chooses between auto-updating posts flagged `featured` (`flag`) and a fixed `pinned` selection. A `limit` (1–20, default 4) caps the count, and `leadCard` (default on) renders the first post large with the rest in a grid. The pinned picker is hidden unless the source is `pinned` and is filtered to the document language.

## Exports

- `default` — the `module.blog-featured` schema definition (built via `defineModule`).

## Usage

```ts
import blogFeatured from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-featured";
// Registered in schema/modules/index.ts; rendered as FeaturedPosts by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-featured.ts`
