---
title: "Cron worker entrypoint"
description: "Bare Cloudflare scheduled Worker that runs the retention purge, erasure-SLA flag, and expired-export cleanup on the two EU D1s."
status: stable
---

# Cron worker entrypoint

> The scheduled deploy shell — retention purge, erasure-SLA flag, expired-export cleanup.

## Purpose

The `scheduled()` entrypoint of the bare Cloudflare cron Worker (no Next/OpenNext). Cloudflare fires it on the `[triggers] crons` schedule in `wrangler.toml`. It runs three passes on the api's two EU D1s: the retention purge (GDPR storage limitation, split per binding), the erasure-SLA flag (GDPR Art. 12(3) one-month deadline), and the expired export-bundle cleanup. `fetch` is only a health check. Each pass logs and rethrows on failure, so a bad tick is marked failed.

## Exports

- `Env` — the bindings this Worker needs: `AUDIT_DB?`, `MAIN_DB?` (both EU D1s), and `EXPORT_BUCKET?` (R2).
- `retentionCutoff` — ISO cutoff `days` before a `scheduledTime` (ms epoch).
- `slaDueSoonCutoff` — ISO horizon `days` after a `scheduledTime`; an erasure request due before this counts as due soon.
- `slaSeverity` — `high` once the due date has passed, `medium` while still approaching.
- `default` — the `ExportedHandler` with `scheduled` and `fetch`.

## Usage

```ts
import { retentionCutoff, slaSeverity } from "@indiecrafts/shared-cron";

const cutoff = retentionCutoff(controller.scheduledTime, 90);
const severity = slaSeverity(row.due_at, new Date().toISOString());
```

## Source

`code/shared/cron/src/index.ts`
