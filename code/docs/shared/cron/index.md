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
schedule; `fetch` is only a health check. The passes live inline in `src/index.ts` (one consumer, so
no brick); shared config comes from `@indiecrafts/packages-shared-config`.

## Triggers

```toml
[triggers]
crons = ["0 * * * *"]   # hourly, UTC
```

Each tick reads the effective retention windows from `site_settings` (D1 override, else the code
default) and runs **four passes, each isolated**: a pass that throws is recorded as `failed` and the
others still run; a pass whose binding is missing is `skipped` with a reason. After all four, the tick
writes one `cron_runs` row, then throws if any pass failed — so Cloudflare marks the run failed.
Cloudflare does not retry a cron run; the next hourly tick re-runs every pass (all are idempotent).

| Pass             | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Counts                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `audit_purge`    | `AUDIT_DB`: `admin_audit` · `session_events` · `security_events` · `cron_runs` past `retention.audit_days` (90-day default); `csp_reports` past `retention.csp_days` (30-day).                                                                                                                                                                                                                                                                                                             | rows deleted per table             |
| `main_purge`     | `MAIN_DB`: `consent_events` past `retention.consent_days` (3-year proof window); `data_requests` past `retention.data_request_days` (365-day); `erasure_requests` past `retention.erasure_request_days`; `churn_events` free text scrubbed past `retention.churn_freetext_days`, the row deleted past `retention.churn_days` (730-day); pseudonymised `user_profiles` hard-deleted past `retention.profile_anonymized_days`; `post_views` (anonymous counters) older than a fixed 90 days. | rows changed per table             |
| `erasure_sla`    | GDPR Art. 12(3) one-month deadline. First closes lapsed requests (never confirmed, link expired) as `expired`. Then flags each **open** request (confirmed, or awaiting confirmation with a live link) at most twice in `AUDIT_DB` `security_events`: `erasure_sla_due` (medium) once when due within `ops.sla_warning_days`, `erasure_sla_breach` (high) once when the deadline passes.                                                                                                   | `expired` · `dueSoon` · `breached` |
| `export_cleanup` | Deletes a `MAIN_DB` `export_requests` row and its `EXPORT_BUCKET` object once its TTL passes unread (a downloaded bundle is already gone).                                                                                                                                                                                                                                                                                                                                                 | `deleted`                          |

## Run now

The cron has **no public URL** (`workers_dev = false` and `preview_urls = false`, top level and every env). Its `fetch` answers `POST /run` by
running one tick — the same `runTick` as the hourly trigger, history row included — and returns
`{status, passes}` (500 when a pass failed); any other request is the health check. Only the api can
reach it, through the `CRON` service binding: `POST /v1/cron/run` (admin-only), behind the **Run now**
button on Scheduled jobs. A service binding to a Worker that doesn't exist fails the deploy, so the
registry deploys the cron **before** the api; the cron needs the api's migrations only at run time.
CI deploys the same way: the cron goes in a first wave, before the parallel wave that holds the api.

## Monitoring

Every tick writes one row to **`cron_runs`** (audit D1, migration `audit/0004`): start and finish time,
`ok`/`failed`, and a `passes` JSON array — each pass's status, counts, and the error **name** or skip
reason. No personal data. Two admin pages read it through the api:

- **Scheduled jobs** (`/cron`, via `GET /v1/cron/status`) — health (healthy · last run failed · stale ·
  never ran), the last run, live counts (erasure open / due soon / deadline passed; exports awaiting
  download / expired but not deleted), and the last 24 runs with per-pass results. **Stale** = no run for
  over 2 hours. The System page shows the same health badge on the `cron` row.
- **Erasure requests** (`/erasure`, via `GET /v1/erasure-requests`) — open requests by deadline, with
  the deadline state and flag times; no identifiers.

## Bindings / env

No secrets. The four passes bind the api's
resources directly (the same `database_id`s and bucket the `api` worker uses); this worker owns none
of them.

| Binding         | Kind         | Holds                                                                                                                                                                  |
| --------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUDIT_DB`      | D1 (`audit`) | `admin_audit` · `session_events` · `security_events` · `csp_reports` · `cron_runs`. Purged; the SLA pass and the run history write here.                               |
| `MAIN_DB`       | D1 (`main`)  | `consent_events` · `data_requests` · `erasure_requests` · `export_requests` · `site_settings` · `churn_events` · `post_views`. Purged, flagged, and read for settings. |
| `EXPORT_BUCKET` | R2           | The api's export-bundle bucket; the cleanup pass sweeps unread bundles. Bound in every env the api binds it (`pnpm test:scripts` enforces).                            |

## Deploy

```bash
pnpm deploy:shared:cron:<dev|staging|prod>   # → code/shared/scripts/deploy/worker.mjs
pnpm deploy:all:<env>                         # every Cloudflare app, in registry order
```

`worker.mjs` runs the rename guard + prod confirm + `wrangler deploy` (no build step). A cron worker
needs no domain or WAF, so it has no Terraform stack. Test a run locally: `pnpm dev` runs the cron
locally with `--test-scheduled` on `:8789` (same state as the api), then
`curl "http://localhost:8789/cdn-cgi/handler/scheduled"`. Full model →
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
