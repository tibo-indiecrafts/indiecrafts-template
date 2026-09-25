---
title: "Post schema"
description: "Sanity document for a blog post — title, body, media, SEO, authors, categories, tags, series, and ranking priority."
status: stable
---

# Post schema

> The Sanity document that describes a blog post.

## Purpose

Defines the `post` document type. It holds the title, excerpt, publish date, `authors`/`categories`/`tags` references, a `featured` flag, a `priority` ranking slider (via the `PrioritySlider` input), optional `series` and `seriesOrder`, the PortableText `body`, the `media` object (slug + cover), and shared `seo`. The Studio splits fields into "Contenu" and "Métadonnées" tabs. There is intentionally no per-post layout override — layout comes from `blog.postModules` or `DefaultPostLayout`. Reference pickers are filtered to the post's language, and orderings support priority-then-date, newest, and A→Z.

## Exports

- `default` — the `post` Sanity document schema definition.

## Usage

```ts
import post from "@indiecrafts/modules-web-blog/sanity/schema/post";
// Registered in sanity/schema/index.ts and composed into the Studio schema array.
```

## Source

`code/modules/web/blog/src/sanity/schema/post.ts`
