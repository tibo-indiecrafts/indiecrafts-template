---
title: API service
description: The shared HTTP JSON API worker for the app, admin, and partners — telemetry sink, GDPR rights, consent, and admin reads.
status: stable
order: 1
---

# API service — `@indiecrafts/shared-api`

## Purpose

> The shared, versioned HTTP API the `app` and `admin` surfaces call — its own domain, its own deploy.

`@indiecrafts/shared-api` is a **bare Cloudflare Worker** (platform class `worker-cf`, no
Next/OpenNext) at `code/shared/api`. It serves the `app` and `admin` surfaces and partners. The
website keeps its own co-located `/api` routes; this is the shared backend those clients call. The
entrypoint `src/index.ts` is a thin shell — the real logic lives in `@indiecrafts/*` bricks
imported `workspace:*`. `withGuard` is Next-only, so the worker re-implements a small inline guard:
a bearer token, the Cloudflare native rate-limit binding, a body cap, and a CORS allowlist. The Clerk-JWT routes the browser calls directly (`/v1/export`, `/v1/erasure/self`, the consent routes) allow the `authorization` header in their preflight — without it the browser (and the mobile WebView) drops the request.

## Routes

One bearer gates the private routes. `APP_API_TOKEN` is the TRUSTED admin/backend key (all routes,
server-side only). Clerk-JWT routes authenticate the caller's own session.

**Public routes** (no bearer):

| Route                                           | What it does                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `GET /health`                                   | Uptime check (`{ok}`). With the bearer: both D1s, the build (`version`, `commit`) and the bindings. |
| `GET /v1/announcements?surface=&locale=`        | Banner + toast from Sanity (public marketing content).                                              |
| `GET/POST /v1/erasure/request`                  | Turnstile-gated GDPR erasure-request form (anti-enumeration).                                       |
| `GET/POST /v1/erasure/confirm`                  | Token + typed-email + TTL + attempt cap; runs the erasure engine.                                   |
| `GET /v1/erasure/status/:token`                 | No-PII status poll for a filed request.                                                             |
| `GET/POST /v1/email-preferences?token=`         | No-login per-category preferences (a signed pref-token).                                            |
| `POST /v1/email-preferences/unsubscribe?token=` | RFC 8058 one-click unsubscribe target.                                                              |
| `GET /v1/export/download?token=`                | Streams the export bundle, deletes it from R2 on first download.                                    |

**Authenticated routes** (bearer or Clerk-JWT):

| Route                                                             | Auth                | What it does                                                                                                                            |
| ----------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /v1/events`                                                 | `APP_API_TOKEN`     | Audit + session sink → EU D1. Kinds: `admin` · `session` · `security` · `consent` · `csp-report`. Every caller is a first-party server. |
| `GET /v1/sessions`                                                | `APP_API_TOKEN`     | Recent session activity for the admin screen.                                                                                           |
| `GET /v1/security`                                                | `APP_API_TOKEN`     | Recent security incidents.                                                                                                              |
| `GET /v1/csp-reports`                                             | `APP_API_TOKEN`     | Aggregated CSP violations.                                                                                                              |
| `GET /v1/churn`                                                   | `APP_API_TOKEN`     | Churn-survey aggregate.                                                                                                                 |
| `GET/PUT /v1/settings`                                            | `APP_API_TOKEN`     | Read/edit `site_settings` (the `cron` worker reads these too).                                                                          |
| `GET /v1/backups/status`                                          | `APP_API_TOKEN`     | Backup-run history + bucket/retention info.                                                                                             |
| `GET /v1/cron/status`                                             | `APP_API_TOKEN`     | Last 24 `cron_runs`, a `stale` flag (no run in 2 h), live erasure/export counts — the admin Scheduled jobs page.                        |
| `GET /v1/erasure-requests`                                        | `APP_API_TOKEN`     | Open erasure requests by deadline + 20 recently closed, with a computed state; no fingerprint or user id — the admin Erasure page.      |
| `POST /v1/erasure-requests/:id/retry`                             | `APP_API_TOKEN`     | Re-run a stuck (`confirmed`) request; email from Clerk by user id, else typed by the operator (fingerprint-checked, never stored).      |
| `POST /v1/erasure-requests/:id/close`                             | `APP_API_TOKEN`     | Close an open request by hand with a required note → `closed_manual`.                                                                   |
| `POST /v1/cron/run`                                               | `APP_API_TOKEN`     | Run one cron tick now over the private `CRON` service binding (admin "Run now").                                                        |
| `POST /v1/profiles/consent`                                       | `APP_API_TOKEN`     | Marketing-consent batch for the admin users list.                                                                                       |
| `POST /v1/data-request` · `GET /v1/data-requests`                 | `APP_API_TOKEN`     | DSAR intake write (→ `{ ok, id }` + receipt email to the requester) + admin list (each row with `due_at`).                              |
| `GET /v1/data-requests/:id` · `POST /v1/data-requests/:id/status` | `APP_API_TOKEN`     | One request + its history; move it (`new` → `in-progress` → `done` / `rejected`, guarded on `from`; closing can email the note).        |
| `POST /v1/clerk-webhook`                                          | Svix-signed         | `user_profiles` sync, welcome email, role→admin alert, Clerk email take-over.                                                           |
| `GET/POST /v1/consent/marketing-email`                            | Clerk-JWT           | The caller's own marketing opt-in.                                                                                                      |
| `GET/POST /v1/consent/email-preferences`                          | Clerk-JWT           | The caller's own per-category preferences.                                                                                              |
| `GET/POST /v1/consent/legal`                                      | Clerk-JWT           | The caller's accepted policy version — accept on one surface, the "policies updated" banner clears on all.                              |
| `POST /v1/erasure/self`                                           | Clerk-JWT + step-up | Self-service erasure; runs the engine, no email round-trip.                                                                             |
| `POST /v1/export`                                                 | Clerk-JWT + step-up | Runs `runExport`, stores the bundle in R2, returns a single-use link.                                                                   |

## Invariants

- **The Clerk delete is required on both erasure paths** (`self` + `confirm`). It is the one global
  session kill-switch: a persistent failure returns `502 {clerk_failed:true}`, keeps the row
  `confirmed`, and sends no completion email — never a false "erasure complete".
- **Studio-editable email copy never blocks a send.** The erasure, Clerk-auth and security-alert emails
  read the `emailStrings` singleton over GROQ-HTTP, resolved to the recipient's locale, with a per-field
  fallback to hard-coded English. The security alert has no `enabled` toggle — it can never be silenced.
- **`PUT /v1/settings` writes `MAIN_DB` first**, then a best-effort `admin_audit` row on `AUDIT_DB` (two
  writes, not one atomic batch).
- **`data_requests` stores plaintext `email` + `message`** — a deliberate exception to the D1
  minimization convention (the operator needs them); `PII_ENCRYPTION_KEY` encrypts them at rest when set.
- **Churn:** only `POST /v1/erasure/self` writes `churn_events`. The Clerk `user.deleted` webhook
  suppresses the Resend contact when a churn row exists, and pure-deletes it otherwise.
  → [Churn tracking](/projects/web/website/config/churn), [Email preferences](/projects/web/website/config/email-preferences).

## Production contract

The five rules every route meets (api brief, "Production-ready contract"; QA card 20):

- **Errors are actionable.** Every error is `{ "error": "<code>", "message": "…", "requestId": "…" }`
  and every response carries `X-Request-Id` — Cloudflare's `cf-ray`, searchable in the dashboard logs
  (a uuid locally). `error` is the stable code to branch on; `message` is for people. An uncaught throw
  is `500 internal`; a missing table or column (a deploy that skipped its migrations) is
  `503 schema_behind`. Retry a 5xx or 429; fix the request on another 4xx.

  | Code                 | Status | Meaning                                                                   |
  | -------------------- | ------ | ------------------------------------------------------------------------- |
  | `unauthorized`       | 401    | Missing or invalid bearer / Clerk token                                   |
  | `forbidden`          | 403    | Valid credentials that cannot do this                                     |
  | `invalid`            | 400    | Body or parameters invalid                                                |
  | `not_found`          | 404    | Nothing at this id                                                        |
  | `method_not_allowed` | 405    | Wrong method for the route                                                |
  | `too_large`          | 413    | Body over the cap — 4 KB; 64 KB on `/v1/clerk-webhook`                    |
  | `rate_limited`       | 429    | Over the rate limit — see below                                           |
  | `too_many_attempts`  | 429    | Erasure-confirm link used 5 times — request a new link (no `Retry-After`) |
  | `unavailable`        | 503    | The route's configuration (secret or binding) is missing                  |
  | `schema_behind`      | 503    | Migrations not applied — run the `db:migrate` script for the env          |
  | `internal`           | 500    | Unexpected — retry once, report the `requestId`                           |

- **Rate limits say when to retry.** Every bearer route and every public write route is limited to
  **20 requests per 60 s per client IP** (the native `RATELIMIT` binding). A first-party server
  call (valid bearer) names the visitor it acts for in `x-client-ip`, and the key is that IP — the
  website server is one IP for every visitor, so per-connection keying made the limit site-wide.
  Without the bearer, or with a value that is not an IP, the header is ignored. A `429 rate_limited` carries
  `Retry-After: 60` and `RateLimit-Policy: 20;w=60`. Cloudflare's limiter reports allowed/denied only,
  so there is no "remaining" header.
- **Duplicates are safe.** `POST /v1/events` accepts an `Idempotency-Key` (1–255 printable
  characters) from a caller holding the server bearer, with a body inside the 4 KB cap. A retry with
  the same key replays the stored answer (`Idempotent-Replayed: true`) for 24 h; the same key with
  another body is `422 idempotency_key_reused`; a key whose first request still runs is
  `409 idempotency_in_progress` — unless it has been unfinished for 30 s (a first attempt cut off
  mid-flight), when the retry takes it over. A 5xx, 429 or throw releases the key. The table holds
  hashes and the `{ ok }` answer only. `POST /v1/export` is **not** covered: its answer is a live
  single-use download link that must never be stored — a retried export makes a second bundle (1 h
  TTL). The other writes are idempotent by key already (`ON CONFLICT` / `INSERT OR IGNORE`, the Svix
  id). First-party callers use `apiFetch` (`@indiecrafts/packages-shared-utils/api-fetch`).
- **Every outbound call has a timeout** — 5 s for Resend, Sanity, Turnstile and every Clerk call
  (`fetchWithTimeout` / `withTimeout` in `src/http.ts`); `apiFetch` gives callers 10 s. A guard test
  fails on a new bare `fetch(`.
- **`/v1` is a contract** — see [API versioning](/shared/api/versioning).

## Bindings / env

Configured per env in `wrangler.toml` under `[env.<env>.*]` (wrangler does not inherit top-level
`[vars]`). The two D1s are EU-only (`--location weur`), split so a firehose write-spike can never
threaten identity data.

| Binding             | Kind                              | Holds                                                                                                                                                                             |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUDIT_DB`          | D1 (`audit`)                      | Append-only firehose: `session_events` · `security_events` · `admin_audit` · `csp_reports` · `backup_runs` · `cron_runs`.                                                         |
| `MAIN_DB`           | D1 (`main`)                       | Identity/rights/settings: `user_profiles` · `consent_events` · `email_preferences` · `data_requests` · `erasure_requests` · `export_requests` · `site_settings` · `churn_events`. |
| `SECURITY_COUNTERS` | KV                                | Ephemeral TTL failed-login counters (counted at the edge, never per-request in D1).                                                                                               |
| `EXPORT_BUCKET`     | R2                                | GDPR export bundles (`POST /v1/export`; routes answer 503 until bound).                                                                                                           |
| `RATELIMIT`         | ratelimit (`[[unsafe.bindings]]`) | Native rate limit on every bearer route, per-env `namespace_id`.                                                                                                                  |
| `CRON`              | service (`[[services]]`)          | The cron Worker, reached privately for `POST /v1/cron/run`. The cron must exist first — `deploy:all` deploys it before the api.                                                   |

**Vars** (`[env.<env>.vars]`, non-secret): `SANITY_PROJECT_ID` · `SANITY_DATASET` ·
`SANITY_API_VERSION` · `EMAIL_FROM` · `BACKUP_BUCKET` · `BACKUP_RETENTION_DAYS`. Optional:
`WEBSITE_URL` · `EMAIL_ADMIN_BCC` · `SECURITY_ALERT_EMAIL` · `EMAIL_BCC_ALL_ENABLED` (dev only).

**Secrets** (`wrangler secret put <NAME> --env <env>`, never in `wrangler.toml`): `APP_API_TOKEN` ·
`IP_HASH_SALT` · `GDPR_FINGERPRINT_SALT` · `CLERK_WEBHOOK_SECRET` ·
`CLERK_SECRET_KEY` · `SANITY_API_READ_TOKEN` · `SANITY_API_WRITE_TOKEN` · `RESEND_API_KEY` ·
`EMAIL_PREF_SECRET` · `TURNSTILE_SECRET` · `PII_ENCRYPTION_KEY` (optional). Copy
`.dev.vars.example` → `.dev.vars` for local `wrangler dev`. Every secret the code reads must be declared
there (commented is fine) and passed by the CI deploy job (`deploy-app.yml` `env:`) — `secrets.mjs` syncs
only declared keys; `worker-secrets.test.mjs` fails on a gap.

`GDPR_FINGERPRINT_SALT` is DISTINCT per env and STABLE within an env. Never rotate a live one — it
orphans every email-keyed lookup.

## Deploy

```bash
pnpm deploy:shared:api:<dev|staging|prod>   # → code/shared/scripts/deploy/worker.mjs
pnpm deploy:all:<env>                        # every Cloudflare app, in registry order
```

`worker.mjs` runs the rename guard + prod confirm, applies the D1 migrations the worker owns
(expand → migrate → contract, each with a fail-closed pre-migration R2 snapshot), then
`wrangler deploy`. Provision a binding with
`node code/shared/scripts/infra/bindings.mjs api <env> <kv|d1|queue> <BINDING>`, then
`pnpm --filter @indiecrafts/shared-api cf-typegen`. Full model →
[Platform deploy](/shared/architecture/platform-deploy).

## Registry

One row in [`code/shared/scripts/lib/apps.mjs`](/shared/scripts/) — CI + deploy read it:

```js
{ slug: "api", pkg: "@indiecrafts/shared-api", class: "worker-cf",
  platform: "shared", kind: "service", dir: "code/shared/api", order: 10,
  smoke: { path: "/health", contains: "ok" } }
```

The api also owns the `main` + `audit` D1s and the `security-counters` KV in `databases.mjs`, an
(inert) Cloudflare edge stack in `infra-registry.mjs`, and a domain row in `domains.mjs`
(prod host `updates.indiecrafts.dev`). Overview of all three workers → [Background Workers](/shared/workers/).
