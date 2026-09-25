---
title: "Collection carousel module"
description: "Page-builder block that shows a hand-picked set of posts as a carousel."
status: stable
---

# Collection carousel module

> A hand-picked, ordered set of posts shown as a carousel.

## Purpose

Defines the `module.blog-collection` page-builder block. An editor sets an optional title and intro, then a required `posts` array (at least one) of post references shown in the chosen order. Unlike the other frontpage blocks it is pinned-only — there is no auto-fill rule. The reference picker is filtered to the document language.

## Exports

- `default` — the `module.blog-collection` schema definition (built via `defineModule`).

## Usage

```ts
import blogCollection from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-collection";
// Registered in schema/modules/index.ts; rendered as a client Carousel by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-collection.ts`
