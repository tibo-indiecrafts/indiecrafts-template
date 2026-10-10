---
title: "Page queries"
description: "GROQ queries for a generic page by slug and for the indexable pages in the sitemap."
status: stable
---

# Page queries

> Fetch, list, and sitemap the generic `page` documents.

## Purpose

GROQ for the generic `page` documents, excluding the home page. One query renders a page by slug and locale. Its `sections[]` and `sidebar` resolve through the blog's `MODULES_FRAGMENT` (the generic blocks and the blog blocks). An unpublished page (`seo.unpublished`) matches nothing, so the route returns 404. The other query lists the pages for the sitemap.

## Exports

- `pageBySlugQuery` — a published `page` by slug and locale, with resolved `sections` and `sidebar`.
- `sitemapPagesQuery` — indexable published pages (slug, language) for the sitemap, dropping unpublished, noindex, and hidden pages.

## Usage

```ts
import { client } from "@indiecrafts/packages-web-sanity/client";
import { pageBySlugQuery } from "@/sanity/page-queries";

const page = await client.fetch(pageBySlugQuery, { slug, locale });
```

## Source

`code/projects/web/surfaces/website/src/sanity/page-queries.ts`
