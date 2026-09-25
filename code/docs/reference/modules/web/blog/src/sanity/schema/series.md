---
title: "Series schema"
description: "Sanity document schema for a blog series — an ordered, localized collection of posts."
status: stable
---

# Series schema

> Defines the `series` Sanity document that groups posts into an ordered multi-part guide.

## Purpose

Declares the `series` Sanity document type used by the blog. A series is an ordered collection of posts; a post points at one series via `post.series` and `post.seriesOrder`, and each series gets its own `/blog/series/<slug>` landing page. The document is localized like the other blog taxonomies (one document per language, via `@sanity/document-internationalization`). It is gated by the `blogSeries` sub-flag.

## Fields

- `language` — hidden, read-only locale field managed by document internationalization.
- `title` — required series title.
- `slug` — required URL fragment for `/blog/series/<slug>`, sourced from `title`.
- `description` — optional intro shown at the top of the series page.
- `seo` — the shared `seoMeta` object for search-visibility overrides.

## Exports

- Default export: the `series` type definition (`defineType`).

## Usage

```ts
import series from "@indiecrafts/modules-web-blog/sanity/schema/series";
// Registered in the blog SanityModule schema list, composed by sanity.config.ts.
```

## Source

`code/modules/web/blog/src/sanity/schema/series.ts`
