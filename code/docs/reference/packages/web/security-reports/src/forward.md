---
title: "CSP report forwarder"
description: "Server-only helper that forwards sanitized CSP reports to the api events endpoint."
status: stable
---

# CSP report forwarder

> Posts sanitized CSP violations to the api, batched and fire-and-forget.

## Purpose

Forwards sanitized CSP reports to the api's `POST /v1/events` (`kind: "csp-report"`). It is `server-only` because it holds `APP_API_TOKEN`, and it sends in batches of 5 to keep each request under the worker's body limit. Fire-and-forget: it no-ops without `API_URL` / `APP_API_TOKEN` and swallows fetch errors.

## Exports

- `forwardCspReports(reports)` — bearer-authed `POST` of the sanitized reports in batches of 5; returns `Promise<void>`.

## Usage

```ts
import { forwardCspReports } from "@indiecrafts/packages-web-security-reports/forward";

await forwardCspReports(sanitizedReports);
```

## Source

`code/packages/web/security-reports/src/forward.ts`
