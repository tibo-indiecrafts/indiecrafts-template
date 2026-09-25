---
title: "Settings cache"
description: "Per-isolate cache of effective site settings read from D1, fail-open to defaults."
status: stable
---

# Settings cache

> Per-isolate cached effective settings — fail-open to code defaults.

## Purpose

Reads the effective site settings for the current Worker isolate and caches them (default ~30s TTL). It merges code defaults with the clamped `site_settings` overrides from D1. Any read failure falls back to defaults, so it never throws.

## Exports

- `readSettings` — return the effective settings map, using the passed cache ref when it is still within the TTL, otherwise re-reading D1.

## Usage

```ts
import { readSettings } from "@indiecrafts/shared-api/settings-cache";

const cacheRef = { value: null };
const settings = await readSettings(env.MAIN_DB, cacheRef);
```

## Source

`code/shared/api/src/settings-cache.ts`
