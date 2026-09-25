---
title: "CSP report parsing"
description: "Pure parsing and PII-safe sanitisation of browser CSP violation reports before they reach the worker."
status: stable
---

# CSP report parsing

> Normalises both browser CSP report formats and strips PII before forwarding.

## Purpose

Pure, framework-free parsing of CSP violation reports. The same-origin surface route calls these before forwarding, so PII never crosses to the worker. The modern `report-to` and legacy `report-uri` formats collapse to one normalized shape, which is then reduced to a sanitised, non-PII record.

## Exports

- `NormalizedCspReport` — the unified shape both browser formats collapse to.
- `SanitizedCspReport` — the PII-safe record forwarded to the worker.
- `isExtensionNoise(blockedUrl)` — true for browser-extension scheme noise.
- `collapseRoute(pathname)` — collapse numeric, UUID, and long-hex path segments to `:id`.
- `normalizeCspReports(raw, contentType)` — parse a raw body into `NormalizedCspReport[]`.
- `sanitizeCspReport(report, surface)` — reduce a normalized report to a `SanitizedCspReport`, or `null` to drop it.

## Usage

```ts
import {
  normalizeCspReports,
  sanitizeCspReport,
} from "@indiecrafts/packages-shared-security/csp-report";

const reports = normalizeCspReports(body, contentType);
const clean = reports
  .map((r) => sanitizeCspReport(r, "website"))
  .filter((r) => r !== null);
```

## Source

`code/packages/shared/security/src/csp-report.ts`
