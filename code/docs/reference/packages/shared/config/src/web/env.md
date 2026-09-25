---
title: "Environment detection"
description: "The only functions that read process.env: environment detection, the CSP connect-src allowlist, and Clerk CSP hosts."
status: stable
---

# Environment detection

> Environment resolution and the CSP source allowlists, isolated in one file.

## Purpose

Isolates the only functions that read `process.env`. `getCurrentEnvironment` gates robots, CSP, and the logger; `getCSPConnectSources` and `getClerkCspHosts` build CSP allowlists consumed by `@indiecrafts/packages-shared-security`.

## Exports

- `parseEnvironment(raw)` — validate an explicit `NEXT_PUBLIC_ENVIRONMENT` against the union; warn and return `undefined` on an unknown value.
- `getCurrentEnvironment()` — the resolved `Environment`, falling back to `NODE_ENV`.
- `getCSPConnectSources(env)` — the CSP `connect-src` hosts (Sanity, npm, and localhost in dev / test).
- `getClerkCspHosts()` — the Clerk CSP hosts derived from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; empty when Clerk is unconfigured.
- `ClerkCspHosts` — the shape returned by `getClerkCspHosts` (`script`, `connect`, `img`, `frame`, `worker`).

## Usage

```ts
import {
  getCurrentEnvironment,
  getCSPConnectSources,
} from "@indiecrafts/packages-shared-config/web";

const env = getCurrentEnvironment();
const connectSrc = getCSPConnectSources(env);
```

## Source

`code/packages/shared/config/src/web/env.ts`
