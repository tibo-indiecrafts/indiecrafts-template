---
title: "Locale suggest desk item"
description: "Studio desk item for the localeSuggest copy singleton."
status: stable
---

# Locale suggest desk item

> The "Suggestion de langue" desk item that opens the editable copy singleton.

## Purpose

Builds the "Suggestion de langue" desk item for the Sanity Studio. It opens the `localeSuggest` copy singleton as a single-document editor. The `localeSuggestSanity` barrel wires it into the desk structure.

## Exports

- `localeSuggestStructureItem(S)` — takes a `StructureBuilder` and returns a `ListItemBuilder` for the copy singleton.

## Usage

```ts
import { localeSuggestStructureItem } from "@indiecrafts/packages-web-locale-suggest/sanity/structure";

structure: (S) => [localeSuggestStructureItem(S)];
```

## Source

`code/packages/web/locale-suggest/src/sanity/structure.ts`
