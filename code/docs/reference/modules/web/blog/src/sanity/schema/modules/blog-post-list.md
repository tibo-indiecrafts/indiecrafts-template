---
title: "Post list module"
description: "Page-builder block that lists posts, filtered by category, featured flag, and a count limit."
status: stable
---

# Post list module

> A filtered list of posts.

## Purpose

Defines the `module.blog-post-list` page-builder block. An editor sets an optional title and intro, an optional `limit` (1–100; empty shows all), a `categories` filter (empty means all), and a `featuredOnly` toggle that restricts to posts flagged `featured`. Posts are filtered by the render locale in GROQ, so the category picker allows any language.

## Exports

- `default` — the `module.blog-post-list` schema definition (built via `defineModule`).

## Usage

```ts
import blogPostList from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-post-list";
// Registered in schema/modules/index.ts; rendered by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-post-list.ts`
