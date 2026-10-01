---
title: "Data export client"
description: "The client-side authenticated POST to the data-export worker route."
status: stable
---

# Data export client

> One export POST that resolves to a download URL or a failure.

## Purpose

The client half of self-service data export. It runs one authenticated POST to the api export route and resolves to a download URL on success, or a failure on any error. Pure and testable. The api requires a recent verification (step-up): on a 403 `rawExportFetch` hands back Clerk's reverification hint, so a surface that wraps it in `useReverification` opens the prompt and retries — same contract as `rawErasureFetch`. Not idempotent: the answer is a live download link, never replayed.

## Exports

- `ExportResult` (type) — `{ ok: true; url: string } | { ok: false }`.
- `requestExport` — the default export (no step-up): `mapExportResponse(await rawExportFetch(input))`.
- `rawExportFetch(input)` — the raw POST shaped for `useReverification`: `{ status, downloadUrl? }`, or the Clerk hint on a 403.
- `mapExportResponse(outcome)` — outcome → `ExportResult` (one source of the mapping).
- `ExportFetchOutcome` (type).

## Usage

```ts
import { requestExport } from "@indiecrafts/packages-shared-compliance/shared";

const result = await requestExport({ apiUrl, getToken });
if (result.ok) window.open(result.url, "_blank", "noopener");
```

## Source

`code/packages/shared/compliance/src/shared/export-self.ts`
