---
title: "Locale suggest Sanity module"
description: "SanityModule barrel contributing the localeSuggest singleton and its desk section."
status: stable
---

# Locale suggest Sanity module

> The brick's Sanity contribution — the `localeSuggest` copy singleton plus its desk section.

## Purpose

Bundles the locale-suggest brick's Sanity contribution as a `SanityModule`: the `localeSuggest` copy singleton schema and its desk section. Add it to the shared modules array in `sanity.config.ts` to activate.

## Exports

- `localeSuggestSanity` — a `SanityModule` with `name`, `schemaTypes`, and `structure` for the language-suggestion copy.

## Usage

```ts
import { localeSuggestSanity } from "@indiecrafts/packages-web-locale-suggest/sanity";

composeStudio([localeSuggestSanity]);
```

## Source

`code/packages/web/locale-suggest/src/sanity/index.ts`
