---
title: "Shared Sanity primitives"
description: "The sharedSanity contribution that registers the doc-agnostic object primitives."
status: stable
---

# Shared Sanity primitives

> The reusable Sanity object types more than one owner needs.

## Purpose

Registers the shared Sanity object primitives so a module never reaches into the app or a sibling module for them: `localeString` (per-locale short string), `localeText` (per-locale multi-line text), and `seoMeta` (the one per-page SEO, LLMs, and visibility model, carried as `.seo` on every rendering document). They are registered once via the `sharedSanity` contribution and referenced by type name everywhere.

## Exports

- `sharedSanity` — the `SanityModule` contribution registering the three primitives.
- `localeString` — the per-locale short-string object schema.
- `localeText` — the per-locale multi-line text object schema.
- `seoMeta` — the per-page SEO, LLMs, and visibility object schema.

## Usage

```ts
import { sharedSanity } from "@indiecrafts/packages-web-schema";

const { schemaTypes } = composeSanity([sharedSanity /* , … */]);
```

## Source

`code/packages/web/schema/src/index.ts`
