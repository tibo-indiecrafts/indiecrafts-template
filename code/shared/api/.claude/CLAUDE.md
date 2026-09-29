# @indiecrafts/shared-api — standalone API (worker-cf)

Auto-loads under `code/shared/api/**`. A **dedicated JSON/GraphQL API** for the web surfaces and partners. The
web app keeps its own co-located `/api` routes; this is the shared, versioned API its servers
and partners call — its own domain, its own deploy. **Activated bare-Worker scaffold — `/health` + the
audit + session sink (`POST /v1/events` → EU D1, `GET /v1/sessions`)**, bearer-gated + CORS allowlist +
the native rate-limit binding (on EVERY bearer route now); `withGuard` is Next-only, so the guard is
inline. **One bearer:** `APP_API_TOKEN` gates the admin read/write routes and `POST /v1/events`
— every caller is a first-party server; never bundled into a client.
Owns **two EU D1s** (both `--location weur`): **`DB`** (`audit` — the append-only firehose:
`session_events`, `security_events`, `admin_audit`, `csp_reports`, `backup_runs`) and **`MAIN_DB`**
(`main` — identity/rights/settings: `user_profiles`, `consent_events`, `email_preferences`,
`data_requests`, `erasure_requests`, `export_requests`, `site_settings`, `churn_events`). Split so a firehose write-spike or migration
can't threaten identity data; `cron` holds both bindings too (retention + settings/SLA/export
bookkeeping). `PUT /v1/settings` writes `site_settings` on `MAIN_DB` (primary) then an `admin_audit`
row on `DB` (best-effort, no longer one atomic batch) — see
[Admin settings](../../../docs/apps/web/config/settings.md).
`POST /v1/clerk-webhook` also keeps `user_profiles` in sync with Clerk (source of truth for email):
upsert + re-fingerprint on `user.created`/`user.updated`, pseudonymise on `user.deleted`; on
`user.created` it also mirrors the sign-up marketing opt-in (`unsafe_metadata.marketing_email`) to
`user_profiles.marketing_email` + a `consent_events` proof row + the Resend contact.
**Commercial-email consent:** `GET`/`POST /v1/consent/marketing-email` (Clerk-JWT; the account toggle +
sign-in nudge read/write the caller's own opt-in) and `POST /v1/profiles/consent` (bearer batch → the
admin users list). Each decision mirrors to Resend's global Contacts (`resend-audience.ts`, keyed by
email — no audience id since Resend renamed Audiences to Segments; `RESEND_API_KEY` unset → no-op);
erasure pure-deletes the contact.
**Legal re-acceptance:** `GET`/`POST /v1/consent/legal` (Clerk-JWT) — a signed-in user's accepted policy
version, so the "policies updated" banner follows them across website · app · mobile (accept on one,
cleared on all). Proof in `consent_events` (`consent_type = 'legal_reaccept'`), current state in
`user_profiles.legal_acked_version` (migration `0011`). Anonymous visitors keep their per-surface local
deposit (cookie / AsyncStorage) — no shared identity to sync by.
**Per-category email preferences** (the editor-defined categories, alongside the single flag above):
`GET`/`POST /v1/consent/email-preferences` (Clerk-JWT) and the no-login
`GET`/`POST /v1/email-preferences?token=` + `POST /v1/email-preferences/unsubscribe?token=` (RFC 8058
one-click) read the `emailPreferences` Sanity singleton (`consent/email-preferences-sanity.ts`,
never-throws — falls back to a seeded `news` category) and write `email_preferences` + a
`consent_events` proof row (`consent_type = 'email_pref:<key>'`). Each write mirrors the changed
categories to Resend **Topics** (`syncContactTopics` in `resend-audience.ts`, per-category
`opt_in`/`opt_out`, `resendTopicId` from Sanity) — the per-category counterpart to the audience mirror
above. Full model → [Email preferences](../../../docs/apps/web/config/email-preferences.md). Secrets:
`APP_API_TOKEN` (trusted server bearer) · `IP_HASH_SALT` ·
`CLERK_WEBHOOK_SECRET` · `EMAIL_PREF_SECRET` (signs the no-login preference token) ·
`GDPR_FINGERPRINT_SALT` (email fingerprint salt, DISTINCT per env (stable within an env) — see `wrangler.toml`) ·
`PII_ENCRYPTION_KEY` (optional AES-256-GCM key — at-rest field encryption for `data_requests` email + message; unset → plaintext, backward compatible). `POST /v1/events` also accepts `kind:csp-report` →
the `csp_reports` D1 table (aggregated CSP violation reports, Report-Only pipeline; 30-day `cron` purge).
`GET /v1/csp-reports` reads it back (bearer-gated, same shape as `GET /v1/security`) for the admin CSP
dashboard.
**Churn tracking:** `POST /v1/erasure/self` (the authenticated self-service delete) is the only writer
of `churn_events` (`main` D1, migration `0010`; `user_id`/`deleted_at`/`reason`/`feedback`/
`competitor`, no email/name) — it captures the exit survey, then suppresses the Resend contact
(`suppressResendContact`: globally unsubscribed, off every marketing topic, opted into the churned
topic) instead of deleting it. The `clerk-deleted` webhook branches on `churn_events`: a row present
suppresses (win-back cohort); no row pure-deletes the contact (`deleteResendContact`), same as the RTBF/
admin carve-out. `POST /v1/erasure/request` → confirm (the GDPR flow) never writes `churn_events` and
never suppresses. `GET /v1/churn` (bearer-gated) reads the `churn_events` aggregate for the admin
dashboard. The churned topic id comes from Sanity — `fetchEmailPreferences` returns `churnedTopicId` +
`optOutTopicIds` alongside the email-preference categories. Full model →
[Churn tracking](../../../docs/apps/web/config/churn.md).
`src/erasure/` holds the store-agnostic erasure
adapters — `d1-core` + `d1-audit` (real, split by table across the `main`/`audit` D1s; the `d1-audit`
adapter takes a read-only handle to `main` to resolve `user_id`) + `clerk`/`sanity`/`orders`
(dependency-injected) — implementing
`@indiecrafts/packages-shared-compliance` `ErasureAdapter`, run by its `runErasure`/`runExport`
orchestrator. The `/v1/erasure` routes are live: `GET/POST /v1/erasure/request` (Turnstile-gated,
anti-enumeration), `GET/POST /v1/erasure/confirm` (token + typed-email fingerprint + TTL + attempt
cap → runs the engine live), `GET /v1/erasure/status/:token` (public, no-PII status), and
`POST /v1/erasure/self` (authenticated self-service; Clerk-JWT + **step-up** + typed-email gate → runs
the engine directly, no email round-trip — the signed-in surfaces' account-delete control will call it).
**The Clerk delete is a REQUIRED step on both erasure paths** (`self` + `confirm`): it is the one global
session kill-switch, so a persistent Clerk-delete failure returns `502 {clerk_failed:true}`, keeps the
row `confirmed` (not `completed`), and sends NO completion email — never a false "erasure complete".
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
`POST /v1/export` (authenticated; Clerk-JWT + **step-up reverification**, same shared
`auth/sensitive-action` gate as `erasure/self` — a stale session gets a `403` challenge) runs
`runExport`, stores the bundle in the `EXPORT_BUCKET` R2 bucket, and returns a single-use 1-hour
download link; `GET
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
