---
title: "Core desk structure items"
description: "Feature-independent Sanity desk items for UI text, navigation, and SEO singletons."
status: stable
---

# Core desk structure items

> The always-present Studio desk items that do not depend on the blog.

## Purpose

Builds the core, feature-independent desk items so they stay editable with the blog removed. Each returns a single desk list item merged into the Studio sidebar by `composeStudio`. They cover the per-locale `uiMessages` singletons (the app's chrome strings), the language-independent `navigation` singleton, and the `siteSettings` plus per-locale `siteMeta` SEO singletons.

## Exports

- `uiMessagesStructureItem(S)` — the per-locale interface-text singletons.
- `navStructureItem(S)` — the navigation singleton (header menu and footer columns).
- `seoStructureItem(S)` — the site settings and per-locale SEO singletons.

## Usage

```ts
import {
  navStructureItem,
  seoStructureItem,
} from "@indiecrafts/packages-web-sanity/structure";

const coreSanity = {
  name: "core",
  structure: (S) => [navStructureItem(S), seoStructureItem(S)],
};
```

## Source

`code/packages/web/sanity/src/structure.ts`
