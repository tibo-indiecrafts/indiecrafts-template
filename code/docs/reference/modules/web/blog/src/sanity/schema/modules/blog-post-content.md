---
title: "Post content module"
description: "Page-builder block that renders the active post's header and body inside the per-post layout."
status: stable
---

# Post content module

> Renders the active post's header and body.

## Purpose

Defines the `module.blog-post-content` page-builder block. It has no fields — the renderer reads the current post from the route context and renders its header (title, author, date, cover) plus its `blockContent` body. Place it once inside `blog.postModules` to show the article body.

## Exports

- `default` — the `module.blog-post-content` schema definition (built via `defineModule`).

## Usage

```ts
import blogPostContent from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-post-content";
// Registered in schema/modules/index.ts; rendered by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-post-content.ts`
