---
title: "Rate-limit presets"
description: "Reusable rate-limit tiers on a shared fixed window, the defaults a web surface starts from."
status: stable
---

# Rate-limit presets

> Named rate-limit tiers for the public API.

## Purpose

Provides reusable rate-limit presets for the public API — the defaults a web surface starts from. A surface still owns its per-route policy, but the rate tiers live here so a second app does not re-invent the numbers. Consumed via `@/config`.

## Exports

- `RATE_WINDOW_SEC` — the fixed-window length for every rate limit (600 seconds).
- `rateLimits` — the named tiers on the shared window: `strict` (5), `standard` (8), `confirm` (10), `lenient` (20).
- `RateLimitTier` — the union of tier names.

## Usage

```ts
import { rateLimits } from "@indiecrafts/packages-shared-config/web";

const { limit, windowSec } = rateLimits.strict;
```

## Source

`code/packages/shared/config/src/web/security.ts`
