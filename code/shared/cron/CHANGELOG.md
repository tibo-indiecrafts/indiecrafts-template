# Changelog — cron (`@indiecrafts/cron`)

Behaviour, schedule, and config changes for the cron worker, in plain language with
the _why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Added

- feat(compliance): retention purge extended to `data_requests` (365 days, on `submitted_at`) and `erasure_requests` (1095 days proof-of-erasure, on `requested_at`). Both were documented for purge but not yet swept; idempotent, no-ops until the DB is bound.
- feat(compliance): cron SLA flag for erasure due dates + expired-export cleanup.

- **Erasure SLA flag (GDPR Art. 12(3) one-month deadline).** The scheduled handler flags
  an `erasure_requests` row once as a `security_events` row when its `due_at` is within 7
  days (`erasure_sla_due`, medium) or already past (`erasure_sla_breach`, high), then sets
  `due_flagged_at` so a later tick doesn't repeat it. Skips `completed`/`cancelled`/
  `expired` requests. Idempotent; no-ops until the DB is bound.
- **Expired-export cleanup.** Deletes `export_requests` rows (+ their R2 object in the
  api's `EXPORT_BUCKET`) once their 1-hour `expires_at` TTL passes unread — a downloaded
  bundle is already deleted on first download; this sweeps the rest. Idempotent; no-ops
  until both the DB and `EXPORT_BUCKET` are bound.

- feat(compliance): purge consent_events on a 3-year window.

- **90-day retention purge (GDPR storage limitation).** The scheduled handler deletes `admin_audit` +
  `session_events` + `security_events` rows older than 90 days from the api's shared **EU** D1 (binding
  `DB`, bound read/write, the same database the api writes). Idempotent; no-ops until the D1 is bound.
  **Why:** enforce the storage-limitation ceiling (GDPR Art. 5(1)(e)) across audit + session + security.

- **Scaffold — a bare scheduled Cloudflare Worker (`@indiecrafts/cron`).** Deploy shell
  (no Next/OpenNext): `src/index.ts` (`scheduled` + a `/health` `fetch`), per-env
  `wrangler.toml` with `[triggers] crons` (hourly default), `scripts/deploy.mjs`
  (rename guard + prod-confirm + `wrangler deploy`). Task logic is imported from
  packages/modules, not written here. Ships `deploy:cron:<env>` + the shared
  `deploy:all:<env>` runner. _Why:_ workers are apps — a deployable belongs in
  `code/projects/`, not a package.
