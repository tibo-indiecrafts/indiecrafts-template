# Changelog — api (`@indiecrafts/api`)

Behaviour, config, and route changes for the API worker, in plain language with the
_why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Changed

- **The AI agent left this Worker — it now lives in its own [`code/shared/agent`](../agent) Worker.** This
  api no longer hosts `POST /v1/agent/:name` (nor `ANTHROPIC_API_KEY`); it serves the audit + session sink
  only. All surfaces now call the dedicated agent Worker. **Why:** the agent deploys, scales, and
  rate-limits independently of this api.

### Added

- feat(compliance): erasure engine wiring — orders seam + adapter barrel + full-engine integration test.
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
