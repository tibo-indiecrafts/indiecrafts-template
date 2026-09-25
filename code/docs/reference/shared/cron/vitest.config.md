---
title: "Vitest config (shared cron)"
description: "Vitest configuration that runs the cron worker tests inside the Workers runtime against the API's real D1 schema."
status: stable
---

# Vitest config (shared cron)

> Runs the `shared/cron` tests in workerd with local D1/R2 bindings and the API's migrations applied.

## Purpose

Configures Vitest for the `@indiecrafts/shared-cron` worker using `@cloudflare/vitest-pool-workers`, so tests run inside the Workers runtime (workerd) driven by the real `wrangler.toml`. Because the cron shares the API's two D1s, it reads the API's own `db/audit` and `db/main` migrations so the test database has the real schema, and provisions local D1 (`AUDIT_DB` and `MAIN_DB` share one id), an R2 `EXPORT_BUCKET`, and a `TEST_MIGRATIONS` binding.

## Exports

- Default export: the async Workers Vitest config (`defineWorkersConfig(async () => …)`).

## Source

`code/shared/cron/vitest.config.ts`
