# Changelog — api (`@indiecrafts/api`)

Behaviour, config, and route changes for the API worker, in plain language with the
_why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Changed

- **DB management: explicit `local`/`dev`/`staging`/`prod` tiers + complete, R2-gated scripts.**
  `dev`/`staging`/`prod` are now real remote D1s; `local` is the disposable miniflare tier — the
  `api`/`cron` `dev` scripts became `wrangler dev --env dev`, so `env.DB` + `env.CORE_DB` resolve
  locally. `migrate.mjs` gains the `local` tier + `--all`, and every REMOTE migration takes a
  pre-migration R2 snapshot that ABORTS on failure (fail-closed; `--no-backup` opts out). A prod
  `db:migrate` / `db:backup` now confirms first (reuses `confirmProd`, auto-skips under `CI`/`--yes`).
  Added the missing `core` migrate scripts, `db:migrate:all:*`, and `db:backup:all:*:remote`, each
  mirrored into `.vscode/tasks.json`. Local flow: `pnpm db:migrate:all:local` → `pnpm dev`. _Why:_
  after the D1 split, `core` had no migrate scripts and local dev bound no database, and "dev" was
  conflated with local — so the real dev DB was never migratable.

- **Split the api's single EU D1 into `core` + `audit`, for identity/audit blast-domain
  isolation.** `core` (new, binding `CORE_DB`) holds `user_profiles`, `consent_events`,
  `data_requests`, `erasure_requests`, `export_requests`, `site_settings`; `audit`
  (binding `DB`, unchanged) keeps `session_events`, `security_events`, `admin_audit`,
  `csp_reports`, `backup_runs`. Both `--location weur`, both owned by this api; `cron`
  holds both bindings too. Erasure now runs a `d1-core` + `d1-audit` adapter through the
  same multi-store `runErasure` receipt (the `d1-audit` adapter takes a read-only handle to
  `core` to resolve `user_id` — a lookup, not a cross-DB transaction). The split also fixes a
  pre-existing duplicate-`0004` migration-numbering collision (each D1 now renumbers its
  own migrations from `0001`). **`PUT /v1/settings` is no longer atomic across the two
  tables it writes** — `site_settings` on `CORE_DB` is primary and unguarded; `admin_audit`
  on `DB` is secondary and best-effort (logged, non-fatal on throw). **Why:** a firehose
  schema change or write-load spike could previously threaten identity/consent/settings
  data sharing the same D1; splitting the blast domain removes that risk with no new
  cross-DB transaction (erasure already ran with no shared transaction across D1+Clerk+
  Sanity). See `docs/superpowers/specs/2026-08-25-audit-db-split-design.md`.

### Added

- **`GET`/`PUT /v1/settings` — bounded, audited operator overrides for worker-read
  operational knobs.** New `core` D1 `site_settings` table (binding `CORE_DB`, migration
  `0007`, overrides only — an absent key falls back to its
  `@indiecrafts/packages-shared-config` default). `GET`
  returns each key's effective value + its default/bounds/unit/last-changed; `PUT` validates
  with `coerceSetting` and **rejects rather than silently clamps** an out-of-range value
  (`422` + the allowed range), then writes the override and an `admin_audit` row
  (`event: "setting_changed"`) — originally the same D1 batch, now split across `CORE_DB`/
  `DB` by the `core`/`audit` D1 split above; every change is still audited. Bearer-gated,
  same trust boundary as the rest of this api; the admin app resolves the Clerk `admin` role
  and forwards `updated_by`. **Why:** retention windows, the SLA warning lead time, and two
  link TTLs were hard-coded constants — changing one meant a code change + redeploy.
- **Export/erasure link TTLs now read from `site_settings` (cached, default-safe).**
  `POST /v1/export`'s download-link TTL and `erasure/request.ts`'s confirm-token TTL read
  their effective value from the new settings table instead of a fixed constant, cached
  per-isolate for ~30s (mirrors `lib/maintenance.ts`) so the hot path doesn't take a D1 read
  per request. Fails open to the code default on any read error. **Why:** an operator's TTL
  override takes effect without a redeploy, without adding latency to every export/erasure
  request.
- **`GET /v1/backups/status` — read-only backup history for the admin Backups card.** New
  `audit` D1 `backup_runs` table (binding `DB`, migration `0003`) the backup scripts write one row to per run (started
  → updated to `ok`/`failed` + `finished_at`; a hard crash leaves `finished_at` null, itself a
  visible signal). The route (bearer-gated) returns the bucket/retention/pre-migration-flag
  from env/config plus the newest 20 `backup_runs` rows, newest first. **Why:** backup
  retention stays a version-controlled R2 lifecycle rule (out of scope for this table — no
  worker reads it, so a D1 value couldn't actually control R2 expiry), but an operator had no
  visibility into whether backups were actually succeeding; this api owns the D1 schema, so
  the backup-history feature lands here even though the writer lives in the scripts.
- **`db:migrate` takes a pre-migration R2 snapshot before every remote schema change.** The
  registry-driven `migrate.mjs` now runs `backup.mjs … --remote` for the target db before applying
  migrations to staging/prod — a bad migration is recoverable. Fail-closed (a failed snapshot aborts
  the migration), `--no-backup` overrides, dev is skipped (local miniflare D1 is disposable). Reuses the
  per-`kind` backup recipe, so a future postgres/supabase db is covered for free. Backups are laid out
  per registry `name` (`<name>/…`) locally and in R2, so more dbs stay one-folder-each; retention is
  30-day R2 lifecycle + newest-10 local. See [backups](../../docs/apps/web/setup/backups.md).
- **One project-wide, EU-resident R2 backups bucket, provisioned in Terraform.** `uploadToR2` now
  targets `<prefix>-<env>-db-backup` (the project slug, not a per-app worker name — so no
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
- feat(compliance): every worker email now BCCs the optional `EMAIL_ADMIN_BCC` address (`[vars]`) — the erasure token + completion emails copy the admin/DPO when set, unchanged when unset.
- feat(compliance): the erasure flow's two transactional emails (`sendErasureTokenEmail`/`sendErasureCompleteEmail`) now read their subject/heading/intro/buttonLabel/outro from the Studio-editable `emailStrings` singleton (`erasureToken`/`erasureComplete` groups), via a new `fetchErasureEmailStrings` helper that mirrors `fetchAnnouncementDocs`'s raw-GROQ-over-HTTP pattern — no new Env vars, no new dependency. Every field falls back to today's hard-coded English on a per-field basis, and the helper never throws: an unset/unreachable Sanity, or an operator setting a group's `enabled: false`, still sends the email with the hard-coded copy. The erasure flow never breaks on missing copy.
- feat(compliance): the erasure token email's confirm link now targets the website (`WEBSITE_URL`) when set, falling back to the worker's own confirm form otherwise.
- **The AI agent left this Worker — it now lives in its own [`code/shared/agent`](../agent) Worker.** This
  api no longer hosts `POST /v1/agent/:name` (nor `ANTHROPIC_API_KEY`); it serves the audit + session sink
  only. All surfaces now call the dedicated agent Worker. **Why:** the agent deploys, scales, and
  rate-limits independently of this api.

### Added

- feat(compliance): **`GET /v1/csp-reports`** — the admin read for aggregated CSP violation groups.
  Bearer-gated (mirrors `GET /v1/security`); returns `csp_reports` rows ordered by `count DESC,
last_seen DESC`, `limit` clamped to 200 (default 100). **Why:** back the admin CSP dashboard so an
  operator can see which violations a strict CSP would block before flipping a surface to `enforce`.
- feat(compliance): `kind:csp-report` writes aggregated `csp_reports` (`audit` D1, migration 0002). `POST
/v1/events` gains a fourth `kind`: the surface forwards sanitized CSP violation reports
  (routes collapsed, samples redacted upstream), and the worker upserts one row per distinct
  `surface|disposition|directive|documentPath|blockedSource` group, incrementing `count` and
  `last_seen` on repeat. Capped at 10 reports per batch. No `country`, no `ip_hash` — a CSP
  violation is about a resource, not a person. **Why:** report-only CSP collection needs a
  bounded, queryable sink without per-request row growth or subject data.
- feat(security): high/critical `security_events` incidents now email the owner/DPO — recipient `SECURITY_ALERT_EMAIL` (`[vars]`), falling back to `EMAIL_ADMIN_BCC`; a no-op (incident still written to D1) when neither is set. Sent non-blocking via `ctx.waitUntil` at the three write sites: `credential_stuffing` (KV threshold), any high/critical incident posted to `POST /v1/events`, and the Clerk-webhook `privilege_escalation`. The email is internal-only, hard-coded English, non-PII (no raw IP, no email), and never fails the request. **Why:** starts the operator's 72-hour GDPR breach-notification clock — see `code/docs/apps/web/config/breach-response.md`.
- feat(compliance): DSAR intake migrated off Sanity into D1 — `data_requests` table (`core` D1, migration 0006) + `POST /v1/data-request` (bearer-gated write; the website's `/api/data-request` route will proxy here) + `GET /v1/data-requests` (bearer-gated read, for the admin screen). A deliberate departure from this D1's minimization convention: the table stores a plaintext, replyable `email` + up to 4000 chars of free-text `message` — short-lived operational PII the operator needs to action a GDPR request, exactly as the Sanity `dataRequest` doc did.
- feat(compliance): data export (Art. 15/20) — `POST /v1/export` verifies the Clerk session JWT, runs `runExport` across every adapter, stores the bundle in the new `EXPORT_BUCKET` R2 bucket, and returns a single-use 1-hour download link. `GET /v1/export/download?token=` streams the bundle and deletes it on first download (single-use, mirrors the erasure hashed-token pattern). `export_requests` D1 table (`core` D1, migration 0004) tracks the token hash + TTL + download state.
- feat(compliance): authenticated self-service erasure — `POST /v1/erasure/self` verifies the Clerk session JWT, requires a matching typed email, then runs the erasure engine directly (no email round-trip). The signed-in surfaces' account-delete control will call it.
- feat(compliance): live erasure routes — `GET/POST /v1/erasure/request` (Turnstile-gated, anti-enumeration), `GET/POST /v1/erasure/confirm` (token hash + typed-email fingerprint + TTL + attempt cap, runs the Phase-3 engine live), and `GET /v1/erasure/status/:token` (public, no-PII status poll).
- feat(compliance): erasure_requests D1 table (`core` D1, migration 0003) — the erasure request lifecycle + single-use confirmation token, keyed by a SHA-256 token hash (`sha256Hex`).
- fix(compliance): D1 erasure adapter — `security_events` delete is now the exact severity complement of the pseudonymised set (no off-list severity value is silently retained); `resolve()` falls back to a plaintext email match when `email_fingerprint` is null.
- feat(compliance): erasure engine wiring — orders seam + adapter barrel + full-engine integration test.
- feat(compliance): D1 erasure adapter (pseudonymise profile/high-severity/consent; delete session + low/medium security).
- feat(compliance): consent_events D1 table (`core` D1, migration 0002) — append-only consent log, 3-year retention.
- feat(compliance): D1 user_profiles table (`core` D1, migration 0001) + workers-pool D1 test harness.
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
  (owner `api`, binding `DB`); migrations (now `db/audit/migrations/0001_init.sql` — this dir was
  `db/d1/` until the `core`/`audit` split above) wired in `wrangler.toml` per
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
  **Superseded** — see "Split the api's single EU D1 into `core` + `audit`" above: identity/rights tables
  moved to a second D1 for blast-domain isolation, at the cost of the lower free-plan count this entry
  chose.

- **Scaffold — a bare Cloudflare Worker (`@indiecrafts/api`).** HTTP API deploy shell
  (no Next/OpenNext): `src/index.ts` (`fetch` + a `/health` route), per-env
  `wrangler.toml`, `scripts/deploy.mjs` (rename guard + prod-confirm + `wrangler
deploy`). Logic is imported from packages/modules, not written here. Ships with
  `deploy:shared:api:<env>` + the shared `deploy:all:<env>` runner. _Why:_ workers are apps —
  a deployable belongs in `code/projects/`, not a package.
