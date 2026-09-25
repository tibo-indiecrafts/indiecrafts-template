---
title: "Data export route"
description: "Authenticated GDPR export — runs runExport, stores the bundle in R2, and returns a single-use expiring download link."
status: stable
---

# Data export route

> A signed-in user downloads a full export of their own data through a single-use R2 link.

## Purpose

Handles the GDPR Art. 15/20 export. `POST /v1/export` proves identity with the Clerk session JWT and the same step-up reverification as self-service erasure, runs `runExport` across every store, stores the bundle in the `EXPORT_BUCKET` R2 bucket, and returns a single-use link that expires after an operator-configurable window. `GET /v1/export/download?token=` claims the row atomically (single-use), reads the bundle fully into memory, deletes it from R2, and streams it back with `cache-control: no-store`.

## Exports

- `handleExport(request, env, ctx?, buildAdapters?, authenticate?)` — the authenticated POST that builds the bundle, stores it in R2, records the `export_requests` row, and returns the download URL.
- `handleExportDownload(request, env, token)` — the single-use download route; validates and atomically claims the token, then streams and deletes the bundle.

## Usage

```ts
import {
  handleExport,
  handleExportDownload,
} from "@indiecrafts/api/export/route";

if (url.pathname === "/v1/export") return handleExport(request, env, ctx);
if (url.pathname.startsWith("/v1/export/download")) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  return handleExportDownload(request, env, token);
}
```

## Source

`code/shared/api/src/export/route.ts`
