---
title: "Vitest config (shared workers)"
description: "Vitest configuration that runs the background-jobs worker tests inside the Workers runtime."
status: stable
---

# Vitest config (shared workers)

> Runs the `shared/workers` tests in workerd, driven by the real `wrangler.toml`.

## Purpose

Configures Vitest for the `@indiecrafts/shared-workers` worker using `@cloudflare/vitest-pool-workers`, so tests run inside the Workers runtime (workerd) driven by the real `wrangler.toml`. This lets `cloudflare:test` `SELF` and `env` exercise the deployed worker and its real bindings. It includes the colocated `src/**/*.test.ts` files.

## Exports

- Default export: the Workers Vitest config (`defineWorkersConfig({ … })`).

## Source

`code/shared/workers/vitest.config.ts`
