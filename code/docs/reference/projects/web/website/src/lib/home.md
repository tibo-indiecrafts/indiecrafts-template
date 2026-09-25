---
title: "Homepage blocks fetcher"
description: "Fetches the homepage page-builder blocks for a locale from Sanity, cached and empty-on-error."
status: stable
---

# Homepage blocks fetcher

> The sole runtime source for the homepage's page-builder blocks.

## Purpose

Reads the page-builder blocks from the `page` document that has `isHome` on, for a given locale. Wrapped in React `cache()`; returns an empty block list on error so a Sanity hiccup renders an empty page instead of throwing. Hidden blocks are dropped in GROQ.

## Exports

- `HomePage` — type: `{ pageModules: BlockModule[] }`.
- `getHomePage(locale)` — cached fetcher returning the homepage's `pageModules`.

## Usage

```ts
import { getHomePage } from "@/lib/home";

const { pageModules } = await getHomePage("en");
```

## Source

`code/projects/web/surfaces/website/src/lib/home.ts`
