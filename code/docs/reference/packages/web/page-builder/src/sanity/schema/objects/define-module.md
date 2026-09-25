---
title: "defineModule helper"
description: "Helper that declares a page-builder module schema with shared anchor and hidden fields."
status: stable
---

# defineModule helper

> Declares a page-builder module schema and appends the shared fields.

## Purpose

Wraps Sanity's `defineType` for page-builder blocks. Every module built with it gets a Sanity `_type` and `_key`, an optional `anchor` field for in-page links, and a `hidden` field to soft-disable the block without deleting it. Pass `fields` for the module's own data, and an optional `preview` to override the generated default. Adapted from the `sanitypress-with-typegen` pattern.

## Exports

- `defineModule` — builds a `module.<name>` schema from `name`, `title`, optional `icon`, `description`, `fields`, and `preview`.

## Usage

```ts
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.stat-list",
  title: "Statistiques",
  fields: [defineField({ name: "title", title: "Titre", type: "string" })],
});
```

## Source

`code/packages/web/page-builder/src/sanity/schema/objects/define-module.ts`
