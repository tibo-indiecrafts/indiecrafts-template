---
title: "Island config injection"
description: "Injects this app's feature flags into the blog and page-builder islands at boot."
status: stable
---

# Island config injection

> How this app's feature toggles reach the islands it mounts.

## Purpose

The blog and the newsletter / waitlist / contact page-builder blocks read app-injected flags because they cannot import an app. This function hands them this app's config, so its feature toggles take effect and a second app can mount the same islands with a different set. Called once at boot from `instrumentation.ts`.

## Exports

- `configureIslands()` — injects blog flags plus the blog page config (`configureBlog`) and the newsletter / waitlist / contact block flags (`configureBlocks`).

## Usage

```ts
import { configureIslands } from "@/lib/islands";

// called once from register() in src/instrumentation.ts
configureIslands();
```

## Source

`code/projects/web/surfaces/website/src/lib/islands.ts`
