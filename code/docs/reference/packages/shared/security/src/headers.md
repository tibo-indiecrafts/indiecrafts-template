---
title: "Security headers"
description: "Builds the hardened Next headers() array plus static CSP rules for routes a proxy does not cover."
status: stable
---

# Security headers

> The hardened Next `headers()` array and the static Studio CSP rule.

## Purpose

Builds the full Next `headers()` array: a hardened same-site security set on every path plus `Cache-Control: immutable` on chosen paths. HSTS is production only. Defaults keep the embedded Sanity Studio working (COOP allow-popups, no COEP). Also provides static permissive CSP rules for routes a proxy cannot cover.

## Exports

- `HeaderRule` — a Next `headers()` rule (`source` plus `headers`).
- `HstsOptions` — HSTS tuning: `maxAge`, `includeSubDomains`, `preload`.
- `SecurityHeadersOptions` — the options for `securityHeaders`, including `env`, `csp`, `hsts`, `coop`, `reporting`, `cspMode`.
- `securityHeaders(opts)` — the full `HeaderRule[]` to spread from `next.config.ts`.
- `permissiveCspRule(source, env, csp?, reporting?)` — one static permissive CSP rule scoped to `source`.
- `studioCspRule(env, csp?, reporting?)` — the permissive CSP rule for `/studio/:path*`.

## Usage

```ts
import { securityHeaders } from "@indiecrafts/packages-shared-security/headers";

const headers = securityHeaders({
  env,
  csp: { googleAnalytics: true },
  immutablePaths: ["/brand/:path*"],
});
```

## Source

`code/packages/shared/security/src/headers.ts`
