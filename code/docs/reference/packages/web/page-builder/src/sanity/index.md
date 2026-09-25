---
title: "Page-builder Sanity module"
description: "SanityModule barrel for the page document, blocks, entities, desk, and create templates."
status: stable
---

# Page-builder Sanity module

> The page-builder's Sanity contribution — schemas, desk sections, and per-locale templates.

## Purpose

Bundles the page-builder's Sanity contribution as a `SanityModule`: the generic `page` document, the block schemas, the `quote` and `person` entities, the shared objects, its desk sections (Pages, Témoignages, Équipe), and per-(type, locale) create templates. It is feature-independent — every site has pages, so it is not gated. Drop `pageBuilderSanity` into `composeStudio([...])` in `sanity.config.ts`.

## Exports

- `pageBuilderSanity` — a `SanityModule` with `schemaTypes`, `structure`, `i18nSchemaTypes`, and locale-scoped `templates`.

## Usage

```ts
import { pageBuilderSanity } from "@indiecrafts/packages-web-page-builder/sanity";

composeStudio([pageBuilderSanity]);
```

## Source

`code/packages/web/page-builder/src/sanity/index.ts`
