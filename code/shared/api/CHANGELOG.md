# Changelog — api (`@indiecrafts/api`)

Behaviour, config, and route changes for the API worker, in plain language with the
_why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Added

- **`db:migrate` takes a pre-migration R2 snapshot before every remote schema change.** The
  registry-driven `migrate.mjs` now runs `backup.mjs … --remote` for the target db before applying
  migrations to staging/prod — a bad migration is recoverable. Fail-closed (a failed snapshot aborts
  the migration), `--no-backup` overrides, dev is skipped (local miniflare D1 is disposable). Reuses the
  per-`kind` backup recipe, so a future postgres/supabase db is covered for free. Backups are laid out
  per registry `name` (`<name>/…`) locally and in R2, so more dbs stay one-folder-each; retention is
  30-day R2 lifecycle + newest-10 local. See [backups](../../docs/apps/web/setup/backups.md).
- **One project-wide, EU-resident R2 backups bucket, provisioned in Terraform.** `uploadToR2` now
  targets `<prefix>-<env>-backups` (the project slug, not a per-app worker name — so no
  `-<platform>-<surface>-` in it; follows `pnpm project:rename`), one bucket per env keyed `<name>/…`.
  `cloudflare_r2_bucket.backups` (website `infra/cloudflare`, `jurisdiction = "eu"`) provisions it;
  retention is a `wrangler r2 bucket lifecycle` step (`backup_retention_days`, default 30 — the
  provider's lifecycle resource is version-sensitive, so it stays a documented command for now).
  Also allowlisted the `csp-report` + `consent-log` report/telemetry sinks in `api-guards.mjs` (they
  authenticate via their handlers, not `withGuard`), so the `verify` guard-adoption check passes.

### Changed

- **`Cache-Control: no-store` on every bearer-gated + webhook response.** The shared `json()` helper
  (all `/v1/events`, `/v1/sessions`, `/v1/security`, `/v1/csp-reports`, `/v1/clerk-webhook` responses)
  now sets `no-store`, so admin data + signed-webhook results are never cached by an intermediary. The
  PUBLIC reads (`/v1/geo`, `/v1/announcements`) build their own cacheable `Response` and are unaffected.
  **Why:** from the wahio webhook/integrity review — sensitive API responses must not be cacheable.
- **The AI agent left this Worker — it now lives in its own [`code/shared/agent`](../agent) Worker.** This
  api no longer hosts `POST /v1/agent/:name` (nor `ANTHROPIC_API_KEY`); it serves the audit + session sink
  only. All surfaces now call the dedicated agent Worker. **Why:** the agent deploys, scales, and
  rate-limits independently of this api.

### Added

- feat(compliance): **`GET /v1/csp-reports`** — the admin read for aggregated CSP violation groups.
  Bearer-gated (mirrors `GET /v1/security`); returns `csp_reports` rows ordered by `count DESC,
last_seen DESC`, `limit` clamped to 200 (default 100). **Why:** back the admin CSP dashboard so an
  operator can see which violations a strict CSP would block before flipping a surface to `enforce`.
- feat(compliance): `kind:csp-report` writes aggregated `csp_reports` (migration 0004). `POST
/v1/events` gains a fourth `kind`: the surface forwards sanitized CSP violation reports
  (routes collapsed, samples redacted upstream), and the worker upserts one row per distinct
  `surface|disposition|directive|documentPath|blockedSource` group, incrementing `count` and
  `last_seen` on repeat. Capped at 10 reports per batch. No `country`, no `ip_hash` — a CSP
  violation is about a resource, not a person. **Why:** report-only CSP collection needs a
  bounded, queryable sink without per-request row growth or subject data.
- feat(compliance): D1 erasure adapter (pseudonymise profile/high-severity/consent; delete session + low/medium security).
- feat(compliance): consent_events D1 table (migration 0003) — append-only consent log, 3-year retention.
- feat(compliance): D1 user_profiles table (migration 0002) + workers-pool D1 test harness.
- feat(compliance): Clerk webhook syncs user_profiles (upsert/re-fingerprint/pseudonymise) + GDPR_FINGERPRINT_SALT.
- **`GET /v1/geo` — the geo signal for the native surfaces.** Public (no bearer, no DB); echoes the
  caller's edge `cf-ipcountry` + the resolved consent mode (`resolveConsentMode` from
  `@indiecrafts/packages-shared-compliance/shared`). Mobile + hybrid (which have no CF headers of their own)
  fetch it on launch to geo-gate their cookie banner; the web surfaces read `cf-ipcountry` server-side.
  **Why:** geo-targeted cookie consent on every surface — see `docs/apps/web/config/cookie-consent-geo.md`.
- **`GET /v1/announcements?locale=&surface=` — the announcement read for the client-gated surfaces.**
  One GROQ round-trip → `resolveBanner`/`resolveToast` (`@indiecrafts/packages-shared-announcement`) →
  `{ banner, toast }`. **Public** (`access-control-allow-origin: *`, no bearer — it is the same
  marketing content the website shows) + a 60s cache. Reads Sanity via new `[vars]`
  (`SANITY_PROJECT_ID`/`SANITY_DATASET`/`SANITY_API_VERSION`) + an optional `SANITY_API_READ_TOKEN`
  secret (503 until set). **Why:** mobile + hybrid + app can't run server-side GROQ; the Worker serves
  them the same content the website reads directly.
- **`POST /v1/events` — the audit + session-event write path (EU D1).** Bearer-gated
  (`APP_API_TOKEN`), writes `admin_audit` / `session_events` in the api's new **EU-resident** D1
  (Cloudflare D1, binding `DB`, `--location weur`). Data-minimized: country (`cf-ipcountry`) + a **salted
  hash of the IP** (`IP_HASH_SALT`, never raw), no user-agent. The D1 is registered in `databases.mjs`
  (owner `api`, binding `DB`); migrations (`db/d1/migrations/0001_init.sql`) wired in `wrangler.toml` per
  env. **Why:** move audit off the console/Logpush sink into a queryable, EU-resident store, with a
  per-surface session log. Retention is the `cron` worker's 90-day purge.
- **`GET /v1/sessions` — recent sign-in activity for the admin sessions screen.** Bearer-gated; returns the
  latest `session_events` (ts · surface · user · **session_id** · country, **no ip_hash** — minimized
  projection), `limit` capped at 200. **Why:** back the admin "view sessions" screen without exposing IPs.
- **`session_events.session_id`.** `POST /v1/events` now stores the Clerk `session_id`, so a history row
  maps to a **revocable** session (the admin sessions screen revokes by it).
- **api domain row.** Added an `api` row (`api.<root>`) to the domains registry so surfaces call a real
  host instead of a long `*.workers.dev` URL (operator sets the host + a wrangler `route`).
- **App-level security events (a third table in the same EU D1).** `POST /v1/events` gains
  `kind:"security"` → the `security_events` table (type · severity · surface · user · country · hashed IP ·
  description). Failed logins are **counted in a KV TTL counter** (`SECURITY_COUNTERS`) and write ONE
  `credential_stuffing` row only when the rate crosses the threshold — never a per-request D1 write; other
  incidents store directly. Detection logic (thresholds + counter) lives in the new
  `@indiecrafts/packages-shared-security-events` brick (services are shells). Adds **`GET /v1/security`**
  (the admin incident feed, ip-hash-free projection) and **`POST /v1/clerk-webhook`** (Svix-verified;
  records a `user.updated` role→admin grant made outside our admin UI). Bearer-authed `GET /health` reports
  the single `db` status. **Why:** app-level incidents Cloudflare's edge WAF can't see — low-volume by
  design (the edge firehose stays in Cloudflare's own dashboard).
- **One EU D1, not two.** `admin_audit` · `session_events` · `security_events` share a single database
  (binding `DB`) instead of separate `audit` + `security` D1s. **Why:** one database keeps the free-plan D1
  count low (3 per env instead of 6); the tables stay isolated (own indexes, own erasure purges).

- **Scaffold — a bare Cloudflare Worker (`@indiecrafts/api`).** HTTP API deploy shell
  (no Next/OpenNext): `src/index.ts` (`fetch` + a `/health` route), per-env
  `wrangler.toml`, `scripts/deploy.mjs` (rename guard + prod-confirm + `wrangler
deploy`). Logic is imported from packages/modules, not written here. Ships with
  `deploy:api:<env>` + the shared `deploy:all:<env>` runner. _Why:_ workers are apps —
  a deployable belongs in `code/projects/`, not a package.
