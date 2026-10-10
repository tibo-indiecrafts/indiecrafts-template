---
title: "Page-builder Sanity module"
description: "Builds the SanityModule for the page document, blocks, sidebar, entities, desk, and create templates."
status: stable
---

# Page-builder Sanity module

> The page-builder's Sanity contribution — schemas, desk sections, and per-locale templates.

## Purpose

`pageBuilderSanity` builds the page-builder's Sanity contribution as a `SanityModule`. It holds the `page` document, the 17 generic blocks, the sidebar types (`sidebar`, `sidebarBlocks`, `sidebarSettings`), the `quote` and `person` entities, and the shared objects. It also adds the desk sections (Accueil, Pages, Barre latérale, Témoignages, Équipe) and per-(type, locale) create templates. It is feature-independent: every site has pages, so it is not gated.

The app passes its own blocks. `sectionTypes` adds to `page.sections[]`. `sidebarTypes` adds to the sidebar cards. Both come on top of the generic blocks. `sidebarPages` lists the page types that the sidebar settings configure, for example `post`.

## Exports

- `pageBuilderSanity({ sectionTypes, sidebarTypes, sidebarPages })` — returns a `SanityModule` with `schemaTypes`, `structure`, `i18nSchemaTypes`, and locale-scoped `templates`.

## Usage

```ts
import { pageBuilderSanity } from "@indiecrafts/packages-web-page-builder/sanity";

composeStudio([
  pageBuilderSanity({
    sectionTypes: BLOG_SECTION_TYPES,
    sidebarTypes: BLOG_SIDEBAR_TYPES,
    sidebarPages: SIDEBAR_PAGES,
  }),
]);
```

## Source

`code/packages/web/page-builder/src/sanity/index.ts`
