# @indiecrafts/shared-api — standalone API (worker-cf)

Auto-loads under `code/shared/api/**`. A **dedicated JSON/GraphQL API** for the non-web clients (`mobile`,
partners). The web app keeps its own co-located `/api` routes; this is the shared, versioned API
those clients call — its own domain, its own deploy. **Activated bare-Worker scaffold — `/health` + the
audit + session sink (`POST /v1/events` → EU D1, `GET /v1/sessions`)**, bearer-gated by `APP_API_TOKEN` +
CORS allowlist + the native rate-limit binding; `withGuard` is Next-only, so the guard is inline. More
routes TBD.
Owns **two EU D1s** (both `--location weur`): **`DB`** (`audit` — the append-only firehose:
`session_events`, `security_events`, `admin_audit`, `csp_reports`, `backup_runs`) and **`MAIN_DB`**
(`main` — identity/rights/settings: `user_profiles`, `consent_events`, `email_preferences`,
`data_requests`, `erasure_requests`, `export_requests`, `site_settings`). Split so a firehose write-spike or migration
can't threaten identity data; `cron` holds both bindings too (retention + settings/SLA/export
bookkeeping). `PUT /v1/settings` writes `site_settings` on `MAIN_DB` (primary) then an `admin_audit`
row on `DB` (best-effort, no longer one atomic batch) — see
[Admin settings](../../../docs/apps/web/config/settings.md).
`POST /v1/clerk-webhook` also keeps `user_profiles` in sync with Clerk (source of truth for email):
upsert + re-fingerprint on `user.created`/`user.updated`, pseudonymise on `user.deleted`; on
`user.created` it also mirrors the sign-up marketing opt-in (`unsafe_metadata.marketing_email`) to
`user_profiles.marketing_email` + a `consent_events` proof row + the Resend audience.
**Commercial-email consent:** `GET`/`POST /v1/consent/marketing-email` (Clerk-JWT; the account toggle +
sign-in nudge read/write the caller's own opt-in) and `POST /v1/profiles/consent` (bearer batch → the
admin users list). Each decision mirrors to a Resend audience (`resend-audience.ts`, `RESEND_AUDIENCE_ID`;
unset → no-op); erasure pure-deletes the contact. Secrets:
`APP_API_TOKEN` · `IP_HASH_SALT` · `CLERK_WEBHOOK_SECRET` · `GDPR_FINGERPRINT_SALT` (email fingerprint
salt, DISTINCT per env (stable within an env) — see `wrangler.toml`). `POST /v1/events` also accepts `kind:csp-report` →
the `csp_reports` D1 table (aggregated CSP violation reports, Report-Only pipeline; 30-day `cron` purge).
`GET /v1/csp-reports` reads it back (bearer-gated, same shape as `GET /v1/security`) for the admin CSP
dashboard. `src/erasure/` holds the store-agnostic erasure
adapters — `d1-core` + `d1-audit` (real, split by table across the `main`/`audit` D1s; the `d1-audit`
adapter takes a read-only handle to `main` to resolve `user_id`) + `clerk`/`sanity`/`orders`
(dependency-injected) — implementing
`@indiecrafts/packages-shared-compliance` `ErasureAdapter`, run by its `runErasure`/`runExport`
orchestrator. The `/v1/erasure` routes are live: `GET/POST /v1/erasure/request` (Turnstile-gated,
anti-enumeration), `GET/POST /v1/erasure/confirm` (token + typed-email fingerprint + TTL + attempt
cap → runs the engine live), `GET /v1/erasure/status/:token` (public, no-PII status), and
`POST /v1/erasure/self` (authenticated self-service; Clerk-JWT + typed-email gate → runs the
engine directly, no email round-trip — the signed-in surfaces' account-delete control will call it).
`WEBSITE_URL` (`[vars]`) sets the confirm-link origin the token email points at; unset falls back to
the worker's own origin. The two erasure emails (`src/erasure/email.ts`) read their copy from the
Studio-editable `emailStrings` singleton (`erasureToken`/`erasureComplete` groups) over raw GROQ-HTTP
(mirrors `fetchAnnouncementDocs`, same Sanity `[vars]`/secret, no new deps), resolved to the subject's
stored locale (`user_profiles.locale`, read before the erasure clears the row), with a per-field
fallback to hard-coded English — a missing/unreachable Sanity, or a group's `enabled: false`, never
stops the send. The **Clerk auth emails** read the same way (`src/clerk-email/sanity.ts`) — the
`authVerification`/`authResetPassword`/`authMagicLink`/`authNewDevice` `emailStrings` groups, resolved
to the recipient's locale, with per-field fallback to the templates' hard-coded en/fr; the Clerk slug
is matched forgivingly (`authKind`), and the read is cached in-worker for 5 min. The **internal
security-alert email** (`src/security/alert.ts`) is Studio-editable too — the `securityAlert` group's
`subjectPrefix`/`intro` (English, un-localized), with the same never-throws GROQ read and English
fallback, but **no `enabled` toggle**: a security alert can never be silenced from Studio.
`POST /v1/export` (authenticated; Clerk-JWT) runs `runExport`, stores the
bundle in the `EXPORT_BUCKET` R2 bucket, and returns a single-use 1-hour download link; `GET
/v1/export/download?token=` streams the bundle and deletes it from R2 on first download. Secret/
binding: `EXPORT_BUCKET` (`[[r2_buckets]]`, operator-provisioned — routes answer 503 until bound).
**DSAR intake** — `src/data-request/route.ts` holds the GDPR request-form write + read, migrated off
Sanity: `POST /v1/data-request` (bearer-gated; the website's `/api/data-request` route proxies here)
inserts into the `data_requests` table (`main` D1, migration 0006), and `GET /v1/data-requests` (bearer-gated)
lists rows newest-first for the admin screen. A deliberate departure from this D1's minimization
convention: `data_requests` stores a plaintext `email` + free-text `message` (operational PII the
operator needs to action the request).

**Framework:** Cloudflare Workers · wrangler · TypeScript. **Platform class:** `worker-cf` (a bare Worker,
no Next/OpenNext). Same runtime as the `workers`/`cron` slots.

**Next steps** (not built yet): add **Hono** — `src/index.ts` becomes a Hono app (`app.get("/v1/...")`
reading Sanity via `@indiecrafts/packages-web-sanity`, guarded by `@indiecrafts/packages-shared-security` `withGuard` + a bearer/JWT check);
version routes (`/v1`); CORS-allowlist the mobile origins. Compose
`@indiecrafts/packages-shared-config`/`logger`/`security`/`sanity`/`schema` (add `@types/node` — see the `workers` brief's
isomorphic-types caveat).

- **Deploy:** `pnpm deploy:shared:api:<dev|staging|prod>` → the shared `shared/scripts/deploy/worker.mjs` (rename guard +
  `wrangler deploy`); or `pnpm deploy:all:<env>`. Bind KV/D1/queues via `shared/scripts/infra/bindings.mjs`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../shared/scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose bricks; **no cross-app imports**; auth every mutating route; never expose a write token.
