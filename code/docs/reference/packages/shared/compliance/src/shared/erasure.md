---
title: "Erasure orchestrator"
description: "A store-agnostic orchestrator that runs each store's erasure adapter and returns an enumerated receipt."
status: stable
---

# Erasure orchestrator

> Runs anonymize, delete, preview, and export across per-store adapters.

## Purpose

The store-agnostic erasure and pseudonymisation orchestrator. It takes an array of `ErasureAdapter` (one per store) and runs them, so no single runtime needs every store's secret. The receipt enumerates every adapter, so a store can never be silently skipped. `ts` and `fingerprint` are injected to keep it deterministic.

## Exports

- `ErasureAdapter` (interface) — one store's operations (`findByEmail` / `export` / `preview` / `anonymize` / `delete`).
- `AdapterMatch` (interface) — a store lookup result.
- `AdapterPreview` (interface) — a dry-run preview per store.
- `AdapterResult` (interface) — the anonymized / deleted counts per store.
- `ErasureMode` (type) — `"erase" | "anonymize"`.
- `ErasureReceipt` (interface) — the run receipt (stores + errors + fingerprint).
- `ExportBundle` (interface) — the collected export result.
- `runErasure` — run every adapter (dry-run previews only; otherwise anonymize then optionally delete).
- `runExport` — collect every adapter's export.

## Usage

```ts
import { runErasure } from "@indiecrafts/packages-shared-compliance/shared";

const receipt = await runErasure(adapters, email, {
  mode: "erase",
  dryRun: false,
  ts: new Date().toISOString(),
  fingerprint,
});
```

## Source

`code/packages/shared/compliance/src/shared/erasure.ts`
