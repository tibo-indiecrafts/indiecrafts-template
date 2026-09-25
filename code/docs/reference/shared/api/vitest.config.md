---
title: "Vitest config (shared API)"
description: "Vitest configuration that runs the shared API tests inside the Workers runtime against the real D1 schema."
status: stable
---

# Vitest config (shared API)

> Runs the `shared/api` tests in workerd with local D1/R2 bindings and the real migrations applied.

## Purpose

Configures Vitest for the `@indiecrafts/shared-api` worker using `@cloudflare/vitest-pool-workers`, so tests run inside the Workers runtime (workerd) driven by the real `wrangler.toml`. It reads both `db/audit` and `db/main` migrations so tests run against the real schema, and provisions local D1 (`AUDIT_DB` and `MAIN_DB` share one id), an R2 `EXPORT_BUCKET`, and test bindings (`APP_API_TOKEN`, `EVENTS_TOKEN`, an empty `CLERK_WEBHOOK_SECRET` to keep the env hermetic, and `TEST_MIGRATIONS`).

## Exports

- Default export: the async Workers Vitest config (`defineWorkersConfig(async () => …)`).

## Source

`code/shared/api/vitest.config.ts`
