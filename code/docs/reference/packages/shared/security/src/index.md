---
title: "Security barrel"
description: "The package entry point re-exporting the CSP, headers, nonce, and image helpers."
status: stable
---

# Security barrel

> The response-side entry point for the security brick.

## Purpose

The package entry point. It re-exports the response-side helpers: the CSP builder, the security-headers array, the per-request nonce pair, and the Next image defaults. The request-side helpers (`guard`, `origin`, `turnstile`, `ip`, `rate-limit`) and `crypto` are consumed through their own subpaths.

## Exports

- CSP builder — `buildCsp`, `buildReportOnlyCsp`, `CspHosts`, `CspReporting`.
- Headers — `securityHeaders`, `studioCspRule`, `permissiveCspRule`, `SecurityHeadersOptions`, `HeaderRule`, `HstsOptions`.
- Nonce — `generateNonce`, `cspHeadersForMode`, `CspMode`.
- Images — `imageDefaults`, `imageRemotePatterns`, `ImageRemotePattern`.

## Usage

```ts
import {
  securityHeaders,
  buildCsp,
} from "@indiecrafts/packages-shared-security";
```

## Source

`code/packages/shared/security/src/index.ts`
