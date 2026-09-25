---
title: "Rate-limit KV setup"
description: "Creates one RATE_LIMIT_KV namespace per environment and wires the ids into wrangler.toml."
status: stable
---

# Rate-limit KV setup

> One-time provisioning for the in-app rate limiter's KV store.

## Purpose

One-time setup for the in-app rate limiter (`@indiecrafts/packages-shared-security` `withGuard`). Creates one `RATE_LIMIT_KV` namespace per environment (dev/staging/prod) via `wrangler`, then uncomments and fills each block's id in `wrangler.toml` (base and dev share the dev namespace; staging and prod each get their own). Idempotent — a no-op once the placeholder id is gone. Until it runs, the limiter fails open (allows).

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm setup:web:website:kv
```

## Source

`code/projects/web/surfaces/website/scripts/setup-kv.mjs`
