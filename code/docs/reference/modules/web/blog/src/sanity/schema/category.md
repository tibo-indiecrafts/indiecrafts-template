---
title: "Category schema"
description: "Sanity document schema for a blog category, with an optional parent reference for sub-categories, localized per language."
status: stable
---

# Category schema

> The Sanity document that describes a blog category.

## Purpose

Defines the `category` document type. It holds a title, URL slug, description, an optional `parent` reference (empty means a top-level category; a parent turns it into a sub-category), and shared SEO metadata. The reference filter restricts the parent picker to the same language and blocks self-reference. The `language` field is managed by `@sanity/document-internationalization`.

## Exports

- `default` — the `category` Sanity document schema definition.

## Usage

```ts
import category from "@indiecrafts/modules-web-blog/sanity/schema/category";
// Registered in sanity/schema/index.ts and composed into the Studio schema array.
```

## Source

`code/modules/web/blog/src/sanity/schema/category.ts`
