---
title: "Erasure request route"
description: "GET renders the erasure request form; POST files an anti-enumeration request and emails a confirmation token."
status: stable
---

# Erasure request route

> The public entry point that files an erasure request without leaking which emails exist.

## Purpose

Handles `/v1/erasure/request`. GET renders the request form (with a Turnstile widget); POST files a request. The POST response is identical whether or not the email matches a subject, so the route cannot be used to enumerate accounts. A row and token email are only ever created for a matched subject, and on the matched path the D1 write and email are backgrounded as one unit so the extra write is not a timing signal. The public POST requires at least one abuse control (Turnstile or the rate-limit binding) or it refuses with 503.

## Exports

- `handleErasureRequest(request, env, ctx?, sendToken?)` — the route handler. `sendToken` is injectable for tests; production omits it.

## Usage

```ts
import { handleErasureRequest } from "@indiecrafts/api/erasure/request";

if (url.pathname === "/v1/erasure/request")
  return handleErasureRequest(request, env, ctx);
```

## Source

`code/shared/api/src/erasure/request.ts`
