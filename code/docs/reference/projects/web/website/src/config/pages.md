---
title: "Pages route map"
description: "The app's route table and the StaticAppPathname union derived from it."
status: stable
---

# Pages route map

> Structural route identity — key, id, slug, and feature gate — for every static page.

## Purpose

`pages` is the app's route table. Each entry carries only structural routing — `key` / `id` / `slug` for route identity plus `enabled` to feature-gate the route — while SEO content (title, description, keywords, OG) is edited in Sanity on each route's doc. The `StaticAppPathname` union is derived from the map's `key` values, so the map is the single source of truth: add an entry and the typed route follows. Legal routes spread their identity from `LEGAL_PAGES` so shells and routes never drift.

## Exports

- `pages` — the route map (`Record<string, PageConfig>`), the single source of route identity.
- `StaticAppPathname` — union of every static route `key` (type-only).
- `AppRoute` — `PageConfig` with `key` tightened to `StaticAppPathname` (type-only).

## Usage

```ts
import { pages } from "@/config";
import type { AppRoute, StaticAppPathname } from "@/config";
```

## Source

`code/projects/web/surfaces/website/src/config/pages.ts`
