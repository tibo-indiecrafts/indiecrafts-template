---
title: "Website origins"
description: "Lists the website's origin for each env, prod first, then local dev."
status: stable
---

# Website origins

> One list of the website's origins for the Studio preview and Sanity's CORS setup.

## Purpose

Builds the website's origins: the sites the Studio previews (`sanity.cli.ts`) and the origins Sanity's CORS list must allow (`sanity-setup.mjs`). For each env, prod first, it takes `NEXT_PUBLIC_SITE_URL` from the website's `wrangler.toml`, else the domain registry (`originFor`). It ends with `LOCAL_ORIGIN`. The list holds origins only, without duplicates; an env with neither value is skipped.

## Exports

- `LOCAL_ORIGIN` — `http://localhost:3000`, the local dev origin.
- `siteOrigins(toml?)` — the origin list. `toml` defaults to the website's `wrangler.toml` contents; a test passes its own string.

## Usage

```js
import { siteOrigins } from "./lib/site-origins.mjs";

const previewOrigins = siteOrigins(); // e.g. ["https://example.com", …, "http://localhost:3000"]
```

## Source

`code/projects/web/surfaces/website/scripts/lib/site-origins.mjs`
