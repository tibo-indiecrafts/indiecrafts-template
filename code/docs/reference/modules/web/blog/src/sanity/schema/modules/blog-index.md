---
title: "Blog index hero module"
description: "Page-builder block that renders the blog index page heading — eyebrow, title, and intro."
status: stable
---

# Blog index hero module

> The heading block for the blog index page.

## Purpose

Defines the `module.blog-index` page-builder block. It holds an optional `eyebrow`, a required `title`, and an optional `intro`. It predates the frontpage/post split and stays a `postModules`-only shell block.

## Exports

- `default` — the `module.blog-index` schema definition (built via `defineModule`).

## Usage

```ts
import blogIndex from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-index";
// Registered in schema/modules/index.ts; rendered by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-index.ts`
