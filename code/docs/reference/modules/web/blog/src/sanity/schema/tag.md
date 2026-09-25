---
title: "Tag schema"
description: "Sanity document type for a lightweight, localized blog tag with its own listing page."
status: stable
---

# Tag schema

> A localized, multi-per-post tag document with a per-locale slug.

## Purpose

Defines the `tag` Sanity document type for the blog. A tag is a light taxonomy label — a post has one category but may carry several tags. Each tag gets its own `/blog/tag/<slug>` page. Localization is handled by `@sanity/document-internationalization`, which sets `language` and gives each locale its own slug.

## Exports

- `default` — the `tag` document type, built with `defineType`. Fields: `language` (hidden, read-only), `title`, `slug`, `description`, and `seo` (`seoMeta`).

## Usage

```ts
import tag from "@indiecrafts/modules-web-blog/sanity/schema/tag";

// registered in the schema barrel that the Studio config consumes
export const schemaTypes = [tag /* , ... */];
```

## Source

`code/modules/web/blog/src/sanity/schema/tag.ts`
