---
title: "Image allowlist"
description: "The Next image remote-host allowlist, formats, and cache TTL to spread into next.config.ts."
status: stable
---

# Image allowlist

> The Next `images` remote-host allowlist plus formats and cache TTL.

## Purpose

The Next `images` defaults: which hosts images may load from, the output formats, and the minimum cache TTL. Spread into `images` in `next.config.ts`. The shapes are structurally compatible with Next's `ImageConfig`.

## Exports

- `ImageRemotePattern` — a `{ protocol, hostname }` remote-pattern entry.
- `imageRemotePatterns` — the allowlisted hosts (Unsplash and `cdn.sanity.io`).
- `imageDefaults` — `remotePatterns`, `formats` (avif, webp), and a one-year `minimumCacheTTL`.

## Usage

```ts
import { imageDefaults } from "@indiecrafts/packages-shared-security/images";

const nextConfig = {
  images: {
    ...imageDefaults,
    loaderFile: "./image-loader.ts",
  },
};
```

## Source

`code/packages/shared/security/src/images.ts`
