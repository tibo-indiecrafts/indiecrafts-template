---
title: Cron service
description: The scheduled worker that enforces data retention and GDPR bookkeeping on the api's two EU D1s.
status: stable
order: 1
---

# Cron service — `@indiecrafts/shared-cron`

## Purpose

> The scheduled worker — retention purges and GDPR bookkeeping, once an hour, on the api's EU D1s.

`@indiecrafts/shared-cron` is a **bare Cloudflare Worker** (platform class `worker-cf`, no
Next/OpenNext) at `code/shared/cron`. Cloudflare fires `scheduled()` on the `[triggers] crons`
schedule; `fetch` is only a health check. The entrypoint `src/index.ts` is a thin deploy shell —
the passes are inline pure helpers, and shared config (`@indiecrafts/packages-shared-config`) comes
from a `workspace:*` brick. A failed pass logs `logger.error(...)` and rethrows, so the run is
marked failed and retried — never silent.

## Triggers

```toml
[triggers]
crons = ["0 * * * *"]   # hourly, UTC
```

Each tick reads the effective retention windows from `site_settings` (D1 override, else the code
default) and runs three passes. All are idempotent and no-op until the relevant D1 is bound.

1. **Retention purge** (GDPR storage limitation), split across the two D1s:
   - `AUDIT_DB` — `admin_audit` · `session_events` · `security_events` at `retention.audit_days`
     (90-day default); `csp_reports` at `retention.csp_days` (30-day).
   - `MAIN_DB` — `consent_events` at `retention.consent_days` (3-year proof window);
     `data_requests` at `retention.data_request_days` (365-day); `erasure_requests` at
     `retention.erasure_request_days`; `churn_events` free-text scrubbed at
     `retention.churn_freetext_days`, then the row deleted at `retention.churn_days` (730-day);
     `user_profiles` rows pseudonymised on erasure hard-deleted past `retention.profile_anonymized_days`.
2. **Erasure-SLA flag** (GDPR Art. 12(3) one-month deadline): flags a `MAIN_DB` `erasure_requests`
   row nearing or past its `due_at` with a `AUDIT_DB` `security_events` row, once, via
   `due_flagged_at`. Event type `erasure_sla_due` (medium) while approaching, `erasure_sla_breach`
   (high) once breached.
3. **Expired-export cleanup**: deletes a `MAIN_DB` `export_requests` row and its `EXPORT_BUCKET` R2
   object once its 1-hour TTL passes unread (a downloaded bundle is already gone).

## Bindings / env

No secrets — `.dev.vars.example` ships only an example placeholder. The three passes bind the api's
resources directly (the same `database_id`s and bucket the `api` worker uses); this worker owns none
of them.

| Binding         | Kind         | Holds                                                                                                                                                   |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUDIT_DB`      | D1 (`audit`) | `admin_audit` · `session_events` · `security_events` · `csp_reports`. Purged; the SLA pass also inserts a row here.                                     |
| `MAIN_DB`       | D1 (`main`)  | `consent_events` · `data_requests` · `erasure_requests` · `export_requests` · `site_settings` · `churn_events`. Purged, flagged, and read for settings. |
| `EXPORT_BUCKET` | R2           | The api's export-bundle bucket; the cleanup pass sweeps unread bundles.                                                                                 |

## Deploy

```bash
pnpm deploy:shared:cron:<dev|staging|prod>   # → code/shared/scripts/deploy/worker.mjs
pnpm deploy:all:<env>                         # every Cloudflare app, in registry order
```

`worker.mjs` runs the rename guard + prod confirm + `wrangler deploy` (no build step). A cron worker
needs no domain or WAF, so it has no Terraform stack. Test a run locally: `wrangler dev`, then
`curl "http://localhost:8787/__scheduled"`. Full model →
[Platform deploy](/shared/architecture/platform-deploy).

## Registry

One row in [`code/shared/scripts/lib/apps.mjs`](/shared/scripts/) — CI deploys it automatically, no
per-app workflow edit:

```js
{ slug: "cron", pkg: "@indiecrafts/shared-cron", class: "worker-cf",
  platform: "shared", kind: "service", dir: "code/shared/cron", order: 10 }
```

`cron` has no `databases.mjs`, `infra-registry.mjs`, or `domains.mjs` row — it binds the api's
databases rather than owning any, and needs no host or edge config. Overview of all three workers →
[Background Workers](/shared/workers/).
