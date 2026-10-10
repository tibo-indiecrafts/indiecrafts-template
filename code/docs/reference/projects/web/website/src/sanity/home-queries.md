---
title: "Home page query"
description: "The GROQ query for the home page document and its resolved page-builder sections."
status: stable
---

# Home page query

> Fetches the `isHome` page and its resolved sections.

## Purpose

The home page is the `page` document with `isHome` on for the current locale. Its `sections[]` blocks resolve through the blog's `MODULES_FRAGMENT` (the generic blocks and the blog blocks: images to CDN URLs, CTA links, refs), aliased to `pageModules`. Its `sidebar` choice resolves through `sidebarProjection` with the same fragment. Consumed by `getHomePage` (`src/lib/home.ts`) and the `(home)` route.

## Exports

- `homePageQuery` — GROQ for the home `page` doc with resolved `pageModules` and `sidebar`.

## Usage

```ts
import { client } from "@indiecrafts/packages-web-sanity/client";
import { homePageQuery } from "@/sanity/home-queries";

const home = await client.fetch(homePageQuery, { locale });
```

## Source

`code/projects/web/surfaces/website/src/sanity/home-queries.ts`
