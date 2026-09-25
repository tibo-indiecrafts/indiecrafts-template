---
title: "Navigation query"
description: "The GROQ query for the language-independent navigation singleton — header menu and footer columns."
status: stable
---

# Navigation query

> Fetches the `navigation` singleton with per-locale labels.

## Purpose

GROQ for the language-independent `navigation` singleton (header menu plus footer columns). Labels and column titles are `localeString` objects with one field per locale, resolved per-request in `getNavigation` (`src/lib/navigation.ts`). `defineQuery` flags it for `sanity typegen`. The query returns null when the doc is absent.

## Exports

- `navigationQuery` — GROQ for the header and footer structure.

## Usage

```ts
import { client } from "@indiecrafts/packages-web-sanity/client";
import { navigationQuery } from "@/sanity/nav-queries";

const nav = await client.fetch(navigationQuery);
```

## Source

`code/projects/web/surfaces/website/src/sanity/nav-queries.ts`
