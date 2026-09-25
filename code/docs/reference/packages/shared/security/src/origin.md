---
title: "Same-site origin check"
description: "A pure same-site origin check that rejects cross-site browser POSTs while letting non-browser callers pass."
status: stable
---

# Same-site origin check

> Rejects cross-site browser POSTs; non-browser callers pass.

## Purpose

A pure same-site origin check for POST route hardening. It rejects cross-site browser POSTs (the CSRF vector for raw route handlers, which have no built-in token). A non-browser caller with no `Origin` passes, because it has no CSRF vector. Pure and unit-testable, with no `server-only` import.

## Exports

- `isSameSiteRequest(req, allowed?)` — true when the request is same-site or a non-browser caller. `allowed` is `true` (same-site only, the default), a `string[]` of extra allowed origins, or `false` to disable.

## Usage

```ts
import { isSameSiteRequest } from "@indiecrafts/packages-shared-security/origin";

if (!isSameSiteRequest(req)) {
  return new Response("forbidden", { status: 403 });
}
```

## Source

`code/packages/shared/security/src/origin.ts`
