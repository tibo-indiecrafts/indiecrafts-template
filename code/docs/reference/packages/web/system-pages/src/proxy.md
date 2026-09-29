---
title: "Maintenance rewrite"
description: "Pure Next middleware helper that rewrites requests to the maintenance page and answers 503 when the site is down."
status: stable
---

# Maintenance rewrite

> The 503 maintenance rewrite for an app's `proxy.ts` — pure, the caller decides `isDown`.

## Purpose

Site-wide maintenance rewrite for an app's Next middleware. When `isDown` is true it rewrites every matched request to `/maintenance` and answers `503` with a `Retry-After` hint; the `/maintenance` guard stops the rewrite looping. It returns `null` when not down, so the caller continues its normal pipeline. Pure — the caller decides `isDown`, keeping the brick free of Sanity.

## Exports

- `maintenanceRewrite(request, isDown)` — returns a `503` rewrite `NextResponse`, or `null` when not down.

## Usage

```ts
import { maintenanceRewrite } from "@indiecrafts/packages-web-system-pages/proxy";

const isDown = features.maintenance || (await getMaintenanceMode());
const res = maintenanceRewrite(request, isDown);
if (res) return res;
return intlMiddleware(request);
```

## Source

`code/packages/web/system-pages/src/proxy.ts`
