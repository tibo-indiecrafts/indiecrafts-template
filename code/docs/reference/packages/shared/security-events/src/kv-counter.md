---
title: "KV TTL counter"
description: "A TTL-scoped counter over a structural KV surface, the DB-free half of app-level detection."
status: stable
---

# KV TTL counter

> A TTL counter over a KV-like store; only a threshold crossing writes to D1.

## Purpose

A small TTL counter over a KV-like store, the DB-free half of app-level detection. Failed-login rates are counted in KV (cheap and ephemeral), not written per-request to D1; only a threshold crossing writes one incident row. The structural `KvLike` type keeps the brick Worker-agnostic and unit-testable with a fake.

## Exports

- `KvLike` — the subset of the Cloudflare KV binding the counter uses (`get` and `put`).
- `bumpCounter(kv, key, ttlSeconds)` — increment a TTL-scoped counter and return the new value. Each hit re-arms `ttlSeconds`. Cloudflare KV enforces a 60-second floor.

## Usage

```ts
import { bumpCounter } from "@indiecrafts/packages-shared-security-events";

const count = await bumpCounter(kv, `failed:${userKey}`, 900);
```

## Source

`code/packages/shared/security-events/src/kv-counter.ts`
