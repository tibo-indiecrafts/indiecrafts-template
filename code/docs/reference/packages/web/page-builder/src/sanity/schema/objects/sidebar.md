---
title: "Sidebar schema"
description: "Defines the sidebar card list, the per-document sidebar field and the per-locale sidebar settings."
status: stable
---

# Sidebar schema

> The Sanity types behind a page's sidebar of cards.

## Purpose

`sidebarSchemas` returns three schema types:

- `sidebarBlocks` — the card list. It accepts only the given block types, at most `SIDEBAR_MAX` cards, with the grouped `blockInsertMenu`.
- `sidebar` — an object with a `mode` (`inherit`, `custom` or `none`) and its `blocks`. The `blocks` field shows only in `custom` mode. A document (`page`, `post`) uses it, and the settings use one per page type.
- `sidebarSettings` — one document per locale, with the id `sidebarSettings-<locale>`. It holds the `default` cards and a `byType` object with one `sidebar` per page type.

`GENERIC_SIDEBAR_TYPES` lists the generic blocks that fit a card. The app adds its own types, for example the blog's.

## Exports

- `sidebarSchemas(types, pageTypes)` — returns `[sidebarBlocks, sidebar, sidebarSettings]`.
- `GENERIC_SIDEBAR_TYPES` — the generic `module.*` types that fit a sidebar card.
- `SIDEBAR_MAX` — the most cards one sidebar holds (`6`).
- `SidebarPageType` — a page type the settings configure, `{ name, title }`.

## Usage

```ts
import {
  GENERIC_SIDEBAR_TYPES,
  sidebarSchemas,
} from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/sidebar";

const types = sidebarSchemas(
  [...GENERIC_SIDEBAR_TYPES, "module.blog-toc"],
  [{ name: "post", title: "Articles" }],
);
```

## Source

`code/packages/web/page-builder/src/sanity/schema/objects/sidebar.ts`
