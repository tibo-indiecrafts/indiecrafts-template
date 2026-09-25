---
title: "App content schema"
description: "The Sanity singleton schema for the signed-in welcome message, with shared, web, and mobile sections."
status: stable
---

# App content schema

> Editor-owned welcome copy for each signed-in surface.

## Purpose

Defines the `appContent` singleton — the editor-owned welcome message shown at the top of the home screen on each signed-in surface. Three sections (`shared`, `web`, `mobile`) each hold a per-locale `welcome` text, read live and short-cached by the app and mobile surfaces so an editor's change appears without a redeploy.

## Exports

- `appContentSchema` — the `appContent` document type definition.
- `appContentStructureItem(S)` — the desk list item for the editable singleton.

## Usage

```ts
import {
  appContentSchema,
  appContentStructureItem,
} from "@/sanity/app-content";

const schemaTypes = [appContentSchema];
const structure = (S) => [appContentStructureItem(S)];
```

## Source

`code/projects/web/surfaces/website/src/sanity/app-content.ts`
