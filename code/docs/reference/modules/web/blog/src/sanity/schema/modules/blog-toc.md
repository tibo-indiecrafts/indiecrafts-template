---
title: "Table of contents card module"
description: "Sidebar card block that lists the headings of the post being read."
status: stable
---

# Table of contents card module

> A sidebar card with the headings of the post being read.

## Purpose

Defines the `module.blog-toc` block. It is a sidebar card for posts only. It shows nothing on other pages or on a post without headings. On a phone, the same list opens from a "On this page" button above the article. An editor sets an optional `title` (empty shows "On this page"). It is in `BLOG_SIDEBAR_TYPES` only, not in the blog's page layouts.

## Exports

- `default` — the `module.blog-toc` schema definition (built via `defineModule`).

## Usage

```ts
import blogToc from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-toc";
// Registered in schema/modules/index.ts; rendered by BlogToc in a SidebarCard.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-toc.ts`
