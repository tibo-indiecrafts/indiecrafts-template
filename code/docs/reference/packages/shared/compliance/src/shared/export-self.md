---
title: "Data export client"
description: "The client-side authenticated POST to the data-export worker route."
status: stable
---

# Data export client

> One export POST that resolves to a download URL or a failure.

## Purpose

The client half of self-service data export. It runs one authenticated POST to the api export route and resolves to a download URL on success, or a failure on any error. Pure and testable.

## Exports

- `ExportResult` (type) — `{ ok: true; url: string } | { ok: false }`.
- `requestExport` — the authenticated export POST.

## Usage

```ts
import { requestExport } from "@indiecrafts/packages-shared-compliance/shared";

const result = await requestExport({ apiUrl, getToken });
if (result.ok) window.open(result.url, "_blank", "noopener");
```

## Source

`code/packages/shared/compliance/src/shared/export-self.ts`
