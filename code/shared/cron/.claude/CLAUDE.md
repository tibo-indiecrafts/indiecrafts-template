# `@indiecrafts/shared-cron` — scheduled worker

Auto-loads under `code/shared/cron/**`. A **bare Cloudflare Worker** (no Next/OpenNext) that runs hourly
on the api's two EU D1s (both bound directly — same `database_id`s the `api` uses): `AUDIT_DB` (the
firehose) and `MAIN_DB` (identity · rights · settings), plus the api's `EXPORT_BUCKET` R2.

**Stack:** Cloudflare Workers (`workerd`) · TypeScript · wrangler 4.

**Four passes, each isolated by `runPass`** (a throw becomes a `failed` result, never an early exit):
`audit_purge` · `main_purge` (retention windows from `site_settings`) · `erasure_sla` (closes lapsed
unverified requests, then flags each open request "due soon" once and "breached" once — `due_flagged_at`
/ `breach_flagged_at`) · `export_cleanup` (unread expired bundles). A missing binding makes a pass
`skipped` with a reason. Every tick writes one **`cron_runs`** row (audit D1) — the admin "Scheduled
jobs" page reads it via `GET /v1/cron/status`; open requests by deadline → admin "Erasure requests".
Full reference → [`code/docs/shared/cron/index.md`](../../../docs/shared/cron/index.md).

## Structure

```
src/index.ts       the passes + `export default { scheduled, fetch }` (fetch = health check)
src/index.test.ts  Vitest in workerd (vitest-pool-workers) — real D1 + R2, the api's migrations
wrangler.toml      per-env bindings + `[triggers] crons` (UTC)
```

## Rules

- **Logic stays inline** in `src/index.ts` — one consumer, so no brick (the repo's ≥2-consumer rule).
- **A failed pass is loud, not blocking:** it logs, the other passes still run, the history row says
  which failed, then the tick throws. Cloudflare does not retry a cron run — the next hourly tick re-runs
  every pass, so every pass must stay idempotent.
- **Bind `EXPORT_BUCKET` in every env the api binds it** — `pnpm test:scripts` (wrangler-parity) fails
  otherwise, and unread GDPR exports would never be deleted.
- **Never store personal data in `cron_runs`** — counts and error names only, never an error message.
- **Worker names** (`indiecrafts-<env>-shared-cron`) belong to `pnpm project:rename <slug>` — never
  hand-edit them.
- **No public URL** (`workers_dev = false`): `POST /run` (one tick, same `runTick`) is reached only
  through the api's `CRON` service binding (admin "Run now"). The registry deploys the cron **before**
  the api, because a binding to a missing Worker fails the deploy.
- **Test a tick locally:** `wrangler dev --test-scheduled` on `:8789` (the `pnpm dev` port), then
  `curl localhost:8789/__scheduled`.

## Deploy

`pnpm deploy:shared:cron:<dev|staging|prod>` → `shared/scripts/deploy/worker.mjs` (rename guard +
prod confirm + `wrangler deploy`, no build step). A registry row in
[`scripts/lib/apps.mjs`](../../../shared/scripts/lib/apps.mjs); no domain or Terraform stack. Log
changes in this app's `CHANGELOG.md`.
