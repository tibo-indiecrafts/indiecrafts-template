---
title: "Overlay stores"
description: "The persisted consent and legal records plus a hydration-safe React subscription hook."
status: stable
---

# Overlay stores

> The consent and legal `localStorage` records, shared by the overlays.

## Purpose

Creates the two persisted records the consent and legal overlays share, each namespaced per deployment by `site.prefix`. The legal gate reads the consent record to suppress itself while the consent banner is up. `useRecord` subscribes to a store hydration-safely, using the store's own getter for the server snapshot.

## Exports

- `consentStore` — the persisted `ConsentRecord` web store.
- `legalStore` — the persisted `LegalAcceptanceRecord` web store.
- `useRecord(store)` — hook returning the store's current record, or `null`.

## Usage

```tsx
import { consentStore, useRecord } from "@/user-interface/overlays/stores";

const record = useRecord(consentStore);
```

## Source

`code/projects/web/surfaces/app/src/user-interface/overlays/stores.ts`
