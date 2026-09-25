---
title: "Category spotlight module"
description: "Page-builder block that highlights a curated row of one category's posts with a view-all link."
status: stable
---

# Category spotlight module

> A spotlight row of posts drawn from one category.

## Purpose

Defines the `module.blog-category-spotlight` page-builder block. An editor picks a required `category` (its title becomes the section title), an optional heading, sub-heading, a `count` cap (1–12, default 4), and an optional `pinned` array. Pinned posts show first, in order; the category's most recent posts fill the rest up to the cap. Reference pickers are filtered to the document language.

## Exports

- `default` — the `module.blog-category-spotlight` schema definition (built via `defineModule`).

## Usage

```ts
import blogCategorySpotlight from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-category-spotlight";
// Registered in schema/modules/index.ts; rendered by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-category-spotlight.ts`
