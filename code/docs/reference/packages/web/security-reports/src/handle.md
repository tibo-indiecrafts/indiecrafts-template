---
title: "CSP report handler"
description: "Same-origin route handler that validates, rate-limits, and sanitizes browser CSP reports before forwarding."
status: stable
---

# CSP report handler

> The no-auth trust boundary for browser CSP violation reports.

## Purpose

Handles the same-origin CSP report sink. The browser POSTs violations here with no auth, so this route is the trust boundary: it accepts only the CSP content-types, caps the body at 64KB, rate-limits per client IP and surface, keeps at most 50 reports, then normalizes, sanitizes, and forwards the survivors. It always answers `204` (or `429` over the limit) and never reflects input.

## Exports

- `handleCspReport(request, opts)` — the route handler; `opts` is `{ surface: string }`; returns `Promise<Response>`.

## Usage

```ts
import { handleCspReport } from "@indiecrafts/packages-web-security-reports/handle";

export function POST(request: Request) {
  return handleCspReport(request, { surface: "website" });
}
```

## Source

`code/packages/web/security-reports/src/handle.ts`
