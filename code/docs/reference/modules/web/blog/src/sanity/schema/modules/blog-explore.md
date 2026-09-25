---
title: "Explore module"
description: "Page-builder block that surfaces categories, tags, or authors to explore, with a link to each listing."
status: stable
---

# Explore module

> A block to explore categories, tags, or authors.

## Purpose

Defines the `module.blog-explore` page-builder block. A required `variant` radio picks what to show — `categories`, `tags`, or `authors`. Optional `heading`, `subheading`, and `viewAll` fields override the default copy. The renderer is a thin wrapper around the existing `ExploreCategories`, `ExploreTags`, and `TopAuthors` sections.

## Exports

- `default` — the `module.blog-explore` schema definition (built via `defineModule`).

## Usage

```ts
import blogExplore from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-explore";
// Registered in schema/modules/index.ts; rendered by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-explore.ts`
