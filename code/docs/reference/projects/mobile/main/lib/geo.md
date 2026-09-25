---
title: "Consent geo resolver"
description: "Resolves the device's consent mode from its edge country via the api /v1/geo, failing safe to opt-in."
status: stable
---

# Consent geo resolver

> The device's consent mode, resolved from its edge country and cached.

## Purpose

Resolves the consent mode for this device. Native apps have no `cf-ipcountry` header of their own, so the api `/v1/geo` (which sees the device's edge country) is the geo source. The country is cached for the next launch, and the mode is resolved with the app's per-country overrides. It fails safe to opt-in when the country cannot be determined and never throws.

## Exports

- `loadConsentMode()` — returns `Promise<ConsentMode>` for this device.

## Usage

```ts
import { loadConsentMode } from "@/lib/geo";

const mode = await loadConsentMode();
```

## Source

`code/projects/mobile/surfaces/main/lib/geo.ts`
