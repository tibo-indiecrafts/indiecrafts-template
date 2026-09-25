---
title: "Trending posts module"
description: "Page-builder block that shows the most popular posts, falling back to most recent when no popularity data exists."
status: stable
---

# Trending posts module

> The most popular posts, or the most recent as a fallback.

## Purpose

Defines the `module.blog-trending` page-builder block. An editor sets an optional title, a `count` cap (1–12, default 4), and an optional `pinned` array. Pinned posts show first, in order; trending posts (or the most recent, when no popularity source exists) fill the rest up to the cap. The popularity rule lives in `lib/popularity.ts`. Reference pickers are filtered to the document language.

## Exports

- `default` — the `module.blog-trending` schema definition (built via `defineModule`).

## Usage

```ts
import blogTrending from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-trending";
// Registered in schema/modules/index.ts; rendered as a SpotlightRow by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-trending.ts`
