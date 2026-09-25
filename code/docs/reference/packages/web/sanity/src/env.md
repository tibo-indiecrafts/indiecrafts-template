---
title: "Sanity env config"
description: "Reads the public Sanity project settings and Studio base path from environment variables."
status: stable
---

# Sanity env config

> The public Sanity project settings, validated at import time.

## Purpose

Reads the Sanity client configuration from environment variables so the same code runs in dev, preview, and prod. Project ID and dataset are public and asserted to be present at import. `apiVersion` and `studioBasePath` fall back to defaults. `studioBasePath` is also the stega `studioUrl` the shared client stamps into click-to-edit overlays.

## Exports

- `projectId` — the Sanity project ID (required).
- `dataset` — the Sanity dataset name (required).
- `apiVersion` — the Sanity API version, default `2025-01-01`.
- `studioBasePath` — where the embedded Studio mounts, default `/studio`.

## Usage

```ts
import {
  projectId,
  dataset,
  apiVersion,
} from "@indiecrafts/packages-web-sanity/env";
```

## Source

`code/packages/web/sanity/src/env.ts`
