---
title: "Maintenance-mode read"
description: "Reads the live maintenance-mode flag from Sanity's CDN, cached per isolate and fail-open."
status: stable
---

# Maintenance-mode read

> The no-deploy maintenance switch — an editor flips it in Studio, the proxy trips on it.

## Purpose

Reads `siteSettings.maintenanceMode` from Sanity's CDN query endpoint (public field, no token) at the edge. An in-memory per-isolate cache (~30s TTL) keeps it to one read per window. It fails open: any error returns "not in maintenance" so a fetch hiccup never 503s the whole site. The build-time `features.maintenance` flag is a hard override that skips this read.

## Exports

- `getMaintenanceMode()` — returns a `Promise<boolean>`, `true` when maintenance mode is on.

## Usage

```ts
import { getMaintenanceMode } from "@/lib/maintenance";

if (await getMaintenanceMode()) {
  // serve the maintenance page
}
```

## Source

`code/projects/web/surfaces/website/src/lib/maintenance.ts`
