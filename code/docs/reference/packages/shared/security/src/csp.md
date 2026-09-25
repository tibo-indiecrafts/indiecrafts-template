---
title: "CSP builder"
description: "Builds the Content-Security-Policy string with hardened defaults, optional nonce, and report-only variants."
status: stable
---

# CSP builder

> The Content-Security-Policy string builder with hardened defaults and per-app host extras.

## Purpose

The Content-Security-Policy builder. Hardened defaults are baked in and an app passes only its own extra hosts through `CspHosts`. The `connect-src` base comes from the config helper `getCSPConnectSources(env)`, so the Sanity Studio keeps working. Passing a nonce switches `script-src` to the strict nonce-gated policy.

## Exports

- `CspHosts` — per-app host extras: `scriptSrc`, `connectSrc`, `frameSrc`, `mediaSrc`, `imgSrc`, `fontSrc`, `embedHosts`, `googleAnalytics`.
- `CspReporting` — the reporting config: `endpoint`, optional `reportOnly` candidate, optional Trusted-Types trial.
- `buildCsp(env, csp?, reporting?, nonce?)` — the CSP string; strict and nonce-gated when a nonce is passed.
- `buildReportOnlyCsp(env, csp, reporting)` — a stricter report-only candidate, or `null` when not configured.
- `buildTrustedTypesReportOnly(reporting)` — a minimal Trusted-Types report-only trial policy, or `null` unless opted in.

## Usage

```ts
import { buildCsp } from "@indiecrafts/packages-shared-security/csp";

const policy = buildCsp(env, {
  googleAnalytics: true,
  frameSrc: ["https://www.youtube-nocookie.com"],
});
```

## Source

`code/packages/shared/security/src/csp.ts`
