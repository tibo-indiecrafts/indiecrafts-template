# Changelog — cron (`@indiecrafts/cron`)

Behaviour, schedule, and config changes for the cron worker, in plain language with
the _why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Added

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
