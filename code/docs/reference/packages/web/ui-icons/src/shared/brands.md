---
title: "Brand mark data"
description: "Generated, platform-agnostic brand and social mark data — one 24x24 path plus brand hex per name."
status: stable
---

# Brand mark data

> The single source of brand and social mark path data.

## Purpose

Platform-agnostic brand-mark data, shared by the web and native `BrandIcon` renderers. Each entry is a 24x24 single path plus the official brand hex, with no DOM dependency. The file is generated from `brands.json` and the `simple-icons` package by `pnpm brands:build`; never hand-edit it (`brands:check` guards drift in CI).

## Exports

- `BrandName` — the union of known brand names.
- `BrandMark` — type for one mark: `title`, `hex`, and `path`.
- `BRANDS` — the record of `BrandName` to `BrandMark`.
- `BRAND_NAMES` — an array of every brand name, for iterating a social row.
- `isBrand` — type guard that narrows a string to `BrandName`.

## Usage

```ts
import {
  BRANDS,
  BRAND_NAMES,
  isBrand,
} from "@indiecrafts/packages-web-ui-icons/shared";

const mark = BRANDS.github; // { title: "GitHub", hex: "#181717", path: "..." }
const known = isBrand("mastodon"); // true
```

## Source

`code/packages/web/ui-icons/src/shared/brands.ts`
