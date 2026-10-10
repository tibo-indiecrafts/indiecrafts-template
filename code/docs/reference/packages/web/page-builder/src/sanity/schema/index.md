---
title: "Schema barrel"
description: "Collects the fixed Sanity schemas the page-builder contributes to the Studio."
status: stable
---

# Schema barrel

> One array of the fixed document, object, and module schemas the page-builder ships.

## Purpose

Collects the fixed page-builder schemas into a single `schemaTypes` array: the `quote` and `person` documents, the reusable `blockContent`, `link` and `cta` objects, and the 17 generic `module.*` schemas. It does not hold the `page` document or the sidebar types. `pageBuilderSanity` builds those from the app's options (`definePage`, `sidebarSchemas`) and adds them.

## Exports

- `schemaTypes` — a `SchemaTypeDefinition[]` with every fixed schema the page-builder registers.

## Usage

```ts
import { schemaTypes } from "@indiecrafts/packages-web-page-builder/sanity/schema";

const types = [
  definePage({ sectionTypes }),
  ...sidebarSchemas(cards, pages),
  ...schemaTypes,
];
```

## Source

`code/packages/web/page-builder/src/sanity/schema/index.ts`
