---
title: "Sanity image loader"
description: "A next/image loader that rewrites Sanity and Unsplash URLs to CDN-sized sources."
status: stable
---

# Sanity image loader

> Rewrites image URLs to edge-resized CDN sources for `next/image`.

## Purpose

The `next/image` loader wired via `images.loaderFile` in `next.config`. Every `next/image` request for a Sanity or Unsplash source is rewritten to a CDN-sized URL, so the edge resizes and re-encodes instead of Next's own optimizer. It is isomorphic, because Next also calls it on the client to build `srcset`. SVGs and non-CDN sources (local paths, data URIs, already-parametrised URLs) pass through untouched.

## Exports

- `sanityImageLoader` — the loader function; also the default export.
- `default` — the same `sanityImageLoader` function.

## Usage

```ts
import { sanityImageLoader } from "@indiecrafts/packages-web-sanity/image";

const src = sanityImageLoader({ src: imageUrl, width: 800, quality: 75 });
```

## Source

`code/packages/web/sanity/src/image.ts`
