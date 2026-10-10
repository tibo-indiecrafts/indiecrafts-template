---
title: "Blog singleton schema"
description: "Sanity singleton that owns the per-post layout, the frontpage module stack, display toggles, and localized comment copy."
status: stable
---

# Blog singleton schema

> The single `blog` document that configures layout, display, and comment copy.

## Purpose

Defines the `blog` singleton document (one instance, `documentId: "blog"`). It owns `postModules` (the layout around every `/blog/[slug]`), `frontpageModules` (the `/blog` frontpage stack), shared and listing-page SEO, a `display` object of ON-by-default toggles that hide blog elements without a deploy, and a `comments` object of `localeString` fields for the on-post comment form copy. Empty module arrays fall back to the code defaults (`DefaultPostLayout` and `DefaultBlogFrontpage`). Both arrays use the grouped `blockInsertMenu`. The sidebar beside the article body is not set here: it lives in « Barre latérale ». The `display.post` toggles have no table-of-contents toggle; the `blog-toc` sidebar card replaces it. It is hidden from omnisearch so an editor cannot create a second copy.

## Exports

- `default` — the `blog` Sanity singleton schema definition.

## Usage

```ts
import blog from "@indiecrafts/modules-web-blog/sanity/schema/documents/blog";
// Registered in sanity/schema/index.ts; the singleton is edited from the desk entry in sanity/structure.ts.
```

## Source

`code/modules/web/blog/src/sanity/schema/documents/blog.ts`
