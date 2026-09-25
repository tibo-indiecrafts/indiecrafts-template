---
title: "Sanity module composition"
description: "The SanityModule contract and the composers that build one embedded Studio from many owners."
status: stable
---

# Sanity module composition

> One contract for every owner's Studio contribution, plus the composers that merge them.

## Purpose

Defines the `SanityModule` contract — everything one owner (the app core, a module, or the shared-schema package) adds to the single embedded Studio: schema types, desk items, templates, i18n types, and email groups. `composeSanity` merges a flat list of contributions into the four inputs `defineConfig` needs. `composeStudio` composes the hub Studio from per-app groups, so one Studio edits many apps' content, organised by app. Adding or removing a module is one line in one array.

## Exports

- `SanityModule` — the contribution type each owner exports.
- `composeSanity(modules)` — merges contributions into schema, templates, i18n types, and one desk resolver.
- `StudioGroup` — a titled group of modules for one app.
- `composeStudio(groups)` — composes the hub Studio, grouping the desk per app.

## Usage

```ts
import { composeStudio } from "@indiecrafts/packages-web-sanity/module";

const { schemaTypes, templates, structure } = composeStudio([
  { title: "Site web", modules: [pageBuilderSanity, sharedSanity] },
]);
```

## Source

`code/packages/web/sanity/src/module.ts`
