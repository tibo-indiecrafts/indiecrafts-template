---
title: "CSP nonce headers"
description: "Per-request nonce generation and the enforced/report-only CSP header pair for a proxy or middleware."
status: stable
---

# CSP nonce headers

> A per-request script nonce plus the enforced and report-only CSP values for a chosen mode.

## Purpose

The per-request half of the CSP setup, for a proxy or middleware that can inject a nonce. It generates a base64 nonce with Web Crypto and returns the enforced and report-only header values for a `CspMode`. It composes `buildCsp` and `buildTrustedTypesReportOnly` from `./csp`.

## Exports

- `CspMode` — the rollout mode: `"report-only"` or `"enforce"`.
- `generateNonce()` — a per-request script nonce (base64 of 16 random bytes).
- `cspHeadersForMode(env, csp, reporting, nonce, mode)` — returns `{ enforced, reportOnly }` for the mode. In enforce mode the strict nonce policy is enforced; in report-only mode the permissive policy stays enforced and the strict policy ships report-only.

## Usage

```ts
import {
  generateNonce,
  cspHeadersForMode,
} from "@indiecrafts/packages-shared-security/csp-nonce";

const nonce = generateNonce();
const { enforced, reportOnly } = cspHeadersForMode(
  env,
  csp,
  reporting,
  nonce,
  "report-only",
);
```

## Source

`code/packages/shared/security/src/csp-nonce.ts`
