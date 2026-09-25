---
title: "Blog hero module"
description: "Page-builder block that features one full-width post — the latest published or a pinned choice."
status: stable
---

# Blog hero module

> One full-width featured post.

## Purpose

Defines the `module.blog-hero` page-builder block. A `source` radio chooses between the auto-updating latest published post (`latest`) and a fixed `pinned` post. `showMeta` (default on) toggles the author and date. The pinned picker is hidden unless the source is `pinned` and is filtered to the document language.

## Exports

- `default` — the `module.blog-hero` schema definition (built via `defineModule`).

## Usage

```ts
import blogHero from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-hero";
// Registered in schema/modules/index.ts; rendered as PostHero by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-hero.ts`
