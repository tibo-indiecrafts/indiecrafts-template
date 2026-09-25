---
title: "Page-builder desk structure"
description: "Builds the page-builder desk sections for the embedded Sanity Studio."
status: stable
---

# Page-builder desk structure

> The Studio desk sections for pages and the entities its blocks reference.

## Purpose

Builds the page-builder's desk sections: Accueil (the home `page`, one pinned document per locale), Pages (every other `page`), and the two generic entities the blocks reference — Témoignages (`quote`) and Équipe (`person`). Each localized type exposes EN and FR children. The app's `composeStudio` stitches these into the "Site web" group.

## Exports

- `pageBuilderStructure(S)` — returns the list items for the page-builder desk sections.

## Usage

```ts
import { pageBuilderStructure } from "@indiecrafts/packages-web-page-builder/sanity/structure";

const pageBuilderSanity = {
  name: "page-builder",
  structure: pageBuilderStructure,
  // …schemaTypes, templates, i18nSchemaTypes
};
```

## Source

`code/packages/web/page-builder/src/sanity/structure.ts`
