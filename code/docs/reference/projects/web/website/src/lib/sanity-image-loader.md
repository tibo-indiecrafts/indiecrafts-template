---
title: "Sanity image loader shim"
description: "In-app wiring shim that re-exports the shared Sanity next/image loader for images.loaderFile."
status: stable
---

# Sanity image loader shim

> A one-line shim — `next.config` needs an in-app module as the loader.

## Purpose

`next.config`'s `images.loaderFile` requires an in-app module whose default export is the loader. The CDN-param logic lives in the shared `@indiecrafts/packages-web-sanity/image` package so it has one home; this file is just the wiring shim that re-exports it.

## Exports

- `default` — the Sanity next/image loader, re-exported from `@indiecrafts/packages-web-sanity/image`.

## Usage

```ts
// next.config.ts
export default {
  images: { loaderFile: "./src/lib/sanity-image-loader.ts" },
};
```

## Source

`code/projects/web/surfaces/website/src/lib/sanity-image-loader.ts`
