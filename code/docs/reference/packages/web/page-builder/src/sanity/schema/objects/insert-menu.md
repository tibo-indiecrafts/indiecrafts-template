---
title: "Block insert menu"
description: "Groups the page-builder blocks in the Studio Add item picker."
status: stable
---

# Block insert menu

> The grouped Studio picker for every block array.

## Purpose

`blockInsertMenu` builds the `options.insertMenu` value of a block array. It sorts the accepted types into fixed groups: "Mise en page", "Contenu", "Médias" and "Formulaires". The `module.blog-*` types go to a "Blog" group. Any other type goes to "Autres". Each group keeps only the types that the array accepts. An empty group is dropped. The picker shows a list view (icon, title, description). It adds a search filter when the array accepts more than 8 types.

## Exports

- `blockInsertMenu(types)` — returns `{ groups, views, filter }` for the given block types.

## Usage

```ts
import { blockInsertMenu } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/insert-menu";

defineField({
  name: "modules",
  type: "array",
  of: types.map((type) => defineArrayMember({ type })),
  options: { insertMenu: blockInsertMenu(types) },
});
```

## Source

`code/packages/web/page-builder/src/sanity/schema/objects/insert-menu.ts`
