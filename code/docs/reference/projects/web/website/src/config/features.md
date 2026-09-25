---
title: "Feature flags"
description: "Build-time on/off switches for whole surfaces and routes."
status: stable
---

# Feature flags

> One line per flag — the structural gates for routes, SSG, sitemap, and llms.txt.

## Purpose

`features` holds the global feature flags: build-time structural gates for whole surfaces (LLM endpoints, feeds, sitemap, legal pages, account actions, blog and its taxonomy/comments/search/series, newsletter, waitlist, contact, Studio, maintenance). Because they gate routes, SSG, sitemap, and llms.txt, they stay in code. Editor-facing on/off toggles live in Sanity on top of the matching flag (the two-layer pattern). Built with `defineFeatures`.

## Exports

- `features` — the frozen feature-flag object produced by `defineFeatures(...)`.

## Usage

```ts
import { features } from "@/config";

if (features.blog) {
  // blog routes are live
}
```

## Source

`code/projects/web/surfaces/website/src/config/features.ts`
