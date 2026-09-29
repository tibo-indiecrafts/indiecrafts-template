---
title: "Overlay stores"
description: "The persisted consent and legal records plus a hydration-safe React subscription hook."
status: stable
---

# Overlay stores

> The consent and legal `localStorage` records, shared by the overlays.

## Purpose

Creates the two persisted records the consent and legal overlays share, each namespaced per deployment by `site.prefix`. The legal gate reads the consent record to suppress itself while the consent banner is up. `useRecord` subscribes to a store. Its server snapshot is `undefined` (not read yet), so the server render and hydration show no banner; the browser's stored record decides after hydration. Reading storage during hydration left a stale banner on screen: React 19 keeps server DOM it does not match.

## Exports

- `consentStore` — the persisted `ConsentRecord` web store.
- `legalStore` — the persisted `LegalAcceptanceRecord` web store.
- `useRecord(store)` — hook returning the store's record, `null` when none is stored, or `undefined` before the browser has read it.
- `useEffectiveLegalVersion()` — the website's live legal version (`fetchLegalVersion`), else the static `policyVersion` when the fetch fails; `null` until the fetch settles.

## Usage

```tsx
import { consentStore, useRecord } from "@/user-interface/overlays/stores";

const record = useRecord(consentStore);
```

## Source

`code/projects/web/surfaces/app/src/user-interface/overlays/stores.ts`
