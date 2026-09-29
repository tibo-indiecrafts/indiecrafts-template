---
title: "Geo regulation resolver"
description: "Resolves a visitor country to a named privacy regulation and the consent mode it implies."
status: stable
---

# Geo regulation resolver

> One algorithm the web surfaces all resolve from.

## Purpose

Resolves a visitor's country to a named privacy regulation (GDPR, UK GDPR, CCPA, and more), and each regulation carries the consent UI `mode` it implies. Pure and framework-agnostic; it reads its data tables from `regions.data`. An override on a parent country cascades to its territories, and unknown geo fails safe to GDPR.

## Exports

- `ConsentConfig` (type) — per-deployment `regulations` and `overrides` merged over the built-ins.
- `resolveRegulation` — the applicable regulation (name + mode) for a country.
- `resolveConsentMode` — the consent mode the banner acts on.
- Re-exports `CONSENT_REGIONS`, `REGULATIONS`, `TERRITORIES`, `ConsentMode`, and `Regulation` from `regions.data`, so this file stays the single public surface.

## Usage

```ts
import { resolveConsentMode } from "@indiecrafts/packages-shared-compliance/shared";

const mode = resolveConsentMode(request.headers.get("cf-ipcountry"));
// "FR" → "opt-in", "US" → "opt-out", unknown → "opt-in" (fails safe to GDPR)
```

## Source

`code/packages/shared/compliance/src/shared/regions.ts`
