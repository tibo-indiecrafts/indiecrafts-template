---
title: "Page queries"
description: "GROQ queries for a generic page by slug and for the indexable pages in the sitemap."
status: stable
---

# Page queries

> Fetch, list, and sitemap the generic `page` documents.

## Purpose

GROQ for the generic `page` documents, excluding the home page. One query renders a page by slug and locale with its `sections[]` resolved through the page-builder `MODULES_FRAGMENT`; the other lists the pages for the sitemap.

## Exports

- `pageBySlugQuery` — a `page` by slug and locale, with resolved sections.
- `sitemapPagesQuery` — indexable published pages (slug, language) for the sitemap, dropping unpublished, noindex, and hidden pages.

## Usage

```ts
import { client } from "@indiecrafts/packages-web-sanity/client";
import { pageBySlugQuery } from "@/sanity/page-queries";

const page = await client.fetch(pageBySlugQuery, { slug, locale });
```

## Source

`code/projects/web/surfaces/website/src/sanity/page-queries.ts`
