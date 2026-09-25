---
title: "Schema barrel"
description: "Collects every Sanity schema the page-builder contributes to the Studio."
status: stable
---

# Schema barrel

> One array of every document, object, and module schema the page-builder ships.

## Purpose

Aggregates the page-builder schemas — the `page` document, the `quote` and `person` documents, the reusable `blockContent` / `link` / `cta` objects, and the generic `module.*` schemas — into a single `schemaTypes` array for the Studio config.

## Exports

- `schemaTypes` — a `SchemaTypeDefinition[]` with every schema the page-builder registers.

## Usage

```ts
import { schemaTypes } from "@indiecrafts/packages-web-page-builder/sanity/schema";
import { defineConfig } from "sanity";

defineConfig({
  schema: { types: schemaTypes },
});
```

## Source

`code/packages/web/page-builder/src/sanity/schema/index.ts`
