---
title: "Page document"
description: "Builds the Sanity schema for the generic editor-driven page — a slug, an ordered array of page-builder blocks, and a sidebar."
status: stable
---

# Page document

> The generic, editor-built page rendered by the app's catch-all route.

## Purpose

`definePage` builds the `page` document: a `slug`, a `sections` array of page-builder blocks, and an optional `sidebar`. The sections accept the generic blocks plus the app's `sectionTypes`, for example the blog's. The Studio picker groups them with `blockInsertMenu`. The `sidebar` field uses the `sidebar` object (`inherit`, `custom` or `none`). The app's `/[locale]/[...slug]` catch-all renders the page. Pages are per-locale via document-internationalization.

The home page is the same `page` model with `isHome` on. There is one per locale, with the fixed id `page-home-<locale>`. It renders at `/`, has no slug, and is excluded from the catch-all and the sitemap page list.

## Exports

- `definePage({ sectionTypes })` — returns the `page` document schema. `sectionTypes` defaults to `[]`.

## Usage

```ts
import { definePage } from "@indiecrafts/packages-web-page-builder/sanity/schema/page";

const page = definePage({ sectionTypes: ["module.blog-featured"] });
```

## Source

`code/packages/web/page-builder/src/sanity/schema/page.ts`
