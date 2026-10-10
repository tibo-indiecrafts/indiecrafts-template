---
title: "Homepage blocks fetcher"
description: "Fetches the homepage page-builder blocks for a locale from Sanity, cached and empty-on-error."
status: stable
---

# Homepage blocks fetcher

> The sole runtime source for the homepage's page-builder blocks.

## Purpose

Reads the page-builder blocks from the `page` document that has `isHome` on, for a given locale. Wrapped in React `cache()`; returns an empty block list on error so a Sanity hiccup renders an empty page instead of throwing. Hidden blocks are dropped in GROQ. `siteBlocks` drops the blog blocks when the blog is off. It also returns the page's own `sidebar` choice.

## Exports

- `HomePage` — type: `{ pageModules: AnyModule[]; sidebar: SidebarField }`.
- `getHomePage(locale)` — cached fetcher returning the homepage's `pageModules` and `sidebar`.

## Usage

```ts
import { getHomePage } from "@/lib/home";

const { pageModules, sidebar } = await getHomePage("en");
```

## Source

`code/projects/web/surfaces/website/src/lib/home.ts`
