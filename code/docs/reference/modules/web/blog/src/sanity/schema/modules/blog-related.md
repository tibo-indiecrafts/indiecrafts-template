---
title: "Related posts card module"
description: "Sidebar card block that lists other posts on the same topic as the post being read."
status: stable
---

# Related posts card module

> A sidebar card with other posts from the category of the post being read.

## Purpose

Defines the `module.blog-related` block. It is a sidebar card for posts only: on any other page it shows nothing. An editor sets an optional `title` (empty shows "More on `<category>`") and a `limit` (1–8, default 4). It is in `BLOG_SIDEBAR_TYPES` only, not in the blog's page layouts.

## Exports

- `default` — the `module.blog-related` schema definition (built via `defineModule`).

## Usage

```ts
import blogRelated from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-related";
// Registered in schema/modules/index.ts; rendered by BlogRelated in a SidebarCard.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-related.ts`
