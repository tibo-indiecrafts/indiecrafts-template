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
a bearer token, the Cloudflare native rate-limit binding, a body cap, and a CORS allowlist.

## Routes

One bearer gates the private routes. `APP_API_TOKEN` is the TRUSTED admin/backend key (all routes,
server-side only). Clerk-JWT routes authenticate the caller's own session.

**Public routes** (no bearer):

| Route                                           | What it does                                                          |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `GET /health`                                   | Uptime check. A bearer-authed caller also gets per-binding D1 status. |
| `GET /v1/announcements?surface=&locale=`        | Banner + toast from Sanity (public marketing content).                |
| `GET/POST /v1/erasure/request`                  | Turnstile-gated GDPR erasure-request form (anti-enumeration).         |
| `GET/POST /v1/erasure/confirm`                  | Token + typed-email + TTL + attempt cap; runs the erasure engine.     |
| `GET /v1/erasure/status/:token`                 | No-PII status poll for a filed request.                               |
| `GET/POST /v1/email-preferences?token=`         | No-login per-category preferences (a signed pref-token).              |
| `POST /v1/email-preferences/unsubscribe?token=` | RFC 8058 one-click unsubscribe target.                                |
| `GET /v1/export/download?token=`                | Streams the export bundle, deletes it from R2 on first download.      |

**Authenticated routes** (bearer or Clerk-JWT):

| Route                                             | Auth                | What it does                                                                                                                            |
| ------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /v1/events`                                 | `APP_API_TOKEN`     | Audit + session sink → EU D1. Kinds: `admin` · `session` · `security` · `consent` · `csp-report`. Every caller is a first-party server. |
| `GET /v1/sessions`                                | `APP_API_TOKEN`     | Recent session activity for the admin screen.                                                                                           |
| `GET /v1/security`                                | `APP_API_TOKEN`     | Recent security incidents.                                                                                                              |
| `GET /v1/csp-reports`                             | `APP_API_TOKEN`     | Aggregated CSP violations.                                                                                                              |
| `GET /v1/churn`                                   | `APP_API_TOKEN`     | Churn-survey aggregate.                                                                                                                 |
| `GET/PUT /v1/settings`                            | `APP_API_TOKEN`     | Read/edit `site_settings` (the `cron` worker reads these too).                                                                          |
| `GET /v1/backups/status`                          | `APP_API_TOKEN`     | Backup-run history + bucket/retention info.                                                                                             |
| `POST /v1/profiles/consent`                       | `APP_API_TOKEN`     | Marketing-consent batch for the admin users list.                                                                                       |
| `POST /v1/data-request` · `GET /v1/data-requests` | `APP_API_TOKEN`     | DSAR intake write + admin list.                                                                                                         |
| `POST /v1/clerk-webhook`                          | Svix-signed         | `user_profiles` sync, welcome email, role→admin alert, Clerk email take-over.                                                           |
| `GET/POST /v1/consent/marketing-email`            | Clerk-JWT           | The caller's own marketing opt-in.                                                                                                      |
| `GET/POST /v1/consent/email-preferences`          | Clerk-JWT           | The caller's own per-category preferences.                                                                                              |
| `POST /v1/erasure/self`                           | Clerk-JWT + step-up | Self-service erasure; runs the engine, no email round-trip.                                                                             |
| `POST /v1/export`                                 | Clerk-JWT + step-up | Runs `runExport`, stores the bundle in R2, returns a single-use link.                                                                   |

## Bindings / env

Configured per env in `wrangler.toml` under `[env.<env>.*]` (wrangler does not inherit top-level
`[vars]`). The two D1s are EU-only (`--location weur`), split so a firehose write-spike can never
threaten identity data.

| Binding             | Kind                              | Holds                                                                                                                                                                             |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUDIT_DB`          | D1 (`audit`)                      | Append-only firehose: `session_events` · `security_events` · `admin_audit` · `csp_reports` · `backup_runs`.                                                                       |
| `MAIN_DB`           | D1 (`main`)                       | Identity/rights/settings: `user_profiles` · `consent_events` · `email_preferences` · `data_requests` · `erasure_requests` · `export_requests` · `site_settings` · `churn_events`. |
| `SECURITY_COUNTERS` | KV                                | Ephemeral TTL failed-login counters (counted at the edge, never per-request in D1).                                                                                               |
| `EXPORT_BUCKET`     | R2                                | GDPR export bundles (`POST /v1/export`; routes answer 503 until bound).                                                                                                           |
| `AGENT_RATELIMIT`   | ratelimit (`[[unsafe.bindings]]`) | Native rate limit on every bearer route, per-env `namespace_id`.                                                                                                                  |

**Vars** (`[env.<env>.vars]`, non-secret): `SANITY_PROJECT_ID` · `SANITY_DATASET` ·
`SANITY_API_VERSION` · `EMAIL_FROM` · `BACKUP_BUCKET` · `BACKUP_RETENTION_DAYS`. Optional:
`WEBSITE_URL` · `EMAIL_ADMIN_BCC` · `SECURITY_ALERT_EMAIL` · `EMAIL_BCC_ALL_ENABLED` (dev only).

**Secrets** (`wrangler secret put <NAME> --env <env>`, never in `wrangler.toml`): `APP_API_TOKEN` ·
`IP_HASH_SALT` · `GDPR_FINGERPRINT_SALT` · `CLERK_WEBHOOK_SECRET` ·
`CLERK_SECRET_KEY` · `SANITY_API_READ_TOKEN` · `SANITY_API_WRITE_TOKEN` · `RESEND_API_KEY` ·
`EMAIL_PREF_SECRET` · `TURNSTILE_SECRET` · `PII_ENCRYPTION_KEY` (optional). Copy
`.dev.vars.example` → `.dev.vars` for local `wrangler dev`.

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
