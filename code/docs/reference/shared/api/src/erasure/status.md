---
title: "Erasure status route"
description: "A public, read-only, no-PII poll of a request's lifecycle state by the plaintext token from the subject's email."
status: stable
---

# Erasure status route

> Lets the subject poll their erasure request state by token, with no PII in the response.

## Purpose

Handles `/v1/erasure/status/:token`. It is a public, read-only lookup of a request's lifecycle state by the plaintext token from the subject's email. The response carries only `status`, `requested_at`, `due_at`, and `completed_at` — never the fingerprint, user id, token hash, or the engine receipt. An empty token returns 404 before hashing, since the hash helper throws on empty input.

## Exports

- `handleErasureStatus(request, env, token)` — the route handler; returns the request's public status fields or a not-found error.

## Usage

```ts
import { handleErasureStatus } from "@indiecrafts/api/erasure/status";

if (url.pathname.startsWith("/v1/erasure/status/")) {
  const token = url.pathname.slice("/v1/erasure/status/".length);
  return handleErasureStatus(request, env, token);
}
```

## Source

`code/shared/api/src/erasure/status.ts`
