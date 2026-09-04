# Changelog — cron (`@indiecrafts/cron`)

Behaviour, schedule, and config changes for the cron worker, in plain language with
the _why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Added

- **Retention purge integration tests for `admin_audit`, `session_events`,
  `security_events`, and `consent_events`.** Seeded-row tests confirm the 90-day purge
  (on `ts`, `DB`) and the 3-year `consent_events` purge (on `ts`, `CORE_DB`) delete rows
  past their cutoff and keep fresh ones, mirroring the existing `csp_reports`/
  `data_requests` test pattern. These four tables were documented as purged but had no
  test coverage.
- **Retention + SLA windows now read from `site_settings`, not hard-coded constants.** The
  scheduled handler's 90-day/3-year retention purge and the erasure-SLA flag now call a new
  `loadSettings()` (`@indiecrafts/packages-shared-config`'s `effectiveSettings`) to load
  `retention.*`/`ops.sla_warning_days` from the api's `core` D1 `site_settings` table
  (binding `CORE_DB`), falling back to the code defaults on an unbound `CORE_DB` or a read error — never blocking the
  purge on a settings read. Idempotent; behavior is byte-identical to today until an
  operator sets an override. **Why:** lets an operator change a retention window from the
  admin Settings card without a cron redeploy.
- **30-day CSP reports purge.** The scheduled handler deletes `csp_reports` rows older
  than 30 days (on `last_seen`) from the api's shared **EU** D1. CSP violations are
  operational signal for debugging, not proof records — no retention duty beyond
  operational usefulness. **Why:** keep csp_reports table bounded; violations are
  ephemeral, not audit-grade data.
- feat(compliance): retention purge extended to `data_requests` (365 days, on `submitted_at`) and `erasure_requests` (1095 days proof-of-erasure, on `requested_at`) — both `core` D1 tables. Both were documented for purge but not yet swept; idempotent, no-ops until `CORE_DB` is bound.
- feat(compliance): cron SLA flag for erasure due dates + expired-export cleanup.

- **Erasure SLA flag (GDPR Art. 12(3) one-month deadline).** The scheduled handler flags
  an `erasure_requests` row once as a `security_events` row when its `due_at` is within 7
  days (`erasure_sla_due`, medium) or already past (`erasure_sla_breach`, high), then sets
  `due_flagged_at` so a later tick doesn't repeat it. Skips `completed`/`cancelled`/
  `expired` requests. `erasure_requests` is a `core` D1 table; the flag itself no-ops until
  `CORE_DB` is bound (the `security_events` row it also writes additionally needs `DB`).
- **Expired-export cleanup.** Deletes `export_requests` rows (a `core` D1 table) + their R2
  object in the api's `EXPORT_BUCKET` once their 1-hour `expires_at` TTL passes unread — a downloaded
  bundle is already deleted on first download; this sweeps the rest. Idempotent; no-ops
  until both `CORE_DB` and `EXPORT_BUCKET` are bound.

- feat(compliance): purge consent_events on a 3-year window.

- **90-day retention purge (GDPR storage limitation).** The scheduled handler deletes `admin_audit` +
  `session_events` + `security_events` rows older than 90 days from the api's **`audit`** EU D1 (binding
  `DB`, bound read/write directly — the same `audit` D1 instance the api writes those tables to). Idempotent; no-ops until the D1 is bound.
  **Why:** enforce the storage-limitation ceiling (GDPR Art. 5(1)(e)) across audit + session + security.

- **Scaffold — a bare scheduled Cloudflare Worker (`@indiecrafts/cron`).** Deploy shell
  (no Next/OpenNext): `src/index.ts` (`scheduled` + a `/health` `fetch`), per-env
  `wrangler.toml` with `[triggers] crons` (hourly default), `scripts/deploy.mjs`
  (rename guard + prod-confirm + `wrangler deploy`). Task logic is imported from
  packages/modules, not written here. Ships `deploy:shared:cron:<env>` + the shared
  `deploy:all:<env>` runner. _Why:_ workers are apps — a deployable belongs in
  `code/projects/`, not a package.
