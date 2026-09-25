---
title: "Page document"
description: "Sanity schema for the generic editor-driven page — a slug plus an ordered array of page-builder blocks."
status: stable
---

# Page document

> The generic, editor-built page rendered by the app's catch-all route.

## Purpose

Defines the `page` document — a `slug` plus a `sections` array of page-builder blocks, rendered by the app's `/[locale]/[...slug]` catch-all through the shared `renderBlock` registry. Pages are per-locale via document-internationalization. The home page is the same `page` model with `isHome` enabled (one per locale, fixed id `page-home-<locale>`); it renders at `/`, carries no slug, and is excluded from the catch-all and the sitemap page list.

## Exports

- `default` — the `page` document schema.

## Usage

```ts
import page from "@indiecrafts/packages-web-page-builder/sanity/schema/page";

// Added to the Studio schema type list.
export const schemaTypes = [page /* , … */];
```

## Source

`code/packages/web/page-builder/src/sanity/schema/page.ts`
