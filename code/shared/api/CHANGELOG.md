# Changelog — api (`@indiecrafts/api`)

Behaviour, config, and route changes for the API worker, in plain language with the
_why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Added

- **Clerk's own sign-in detections reach the security feed.** Clerk locks an account after
  failed sign-ins and flags a new-device sign-in, but it emails only the user. The Clerk
  webhook now records them when their email passes through the api (`email.created`):
  `account_locked` → `credential_stuffing` high, which alerts the owner; `new_device_sign_in`
  → `suspicious_pattern` low, feed only. Written after the send, so a Clerk retry adds no
  duplicate. Every security write now goes through one helper, `recordIncident`
  (`src/security/record.ts`).

### Fixed

- **A role→admin grant alerts once, not on every edit of an admin.** The Clerk webhook wrote a
  `privilege_escalation` row and emailed the owner on every `user.updated` of a user who was
  admin — a name change paged the operator. Clerk sends no previous values, so the webhook now
  keeps the last role it saw in `user_profiles.role` (main migration `0014`) and records a grant
  only when the role turns `admin`. It now also checks `user.created`. Every grant counts, from
  the admin UI too: a compromised admin who grants a second admin must page the owner. The
  description no longer says "out-of-band". After the migration, an existing admin counts as
  a grant once, on their next update.
- **A failed-login burst writes two incidents, not one per attempt.** Past the threshold, every
  further failed login wrote another `credential_stuffing` row and sent another alert — a
  100-attempt attack meant 96 rows and 96 emails. Now one `high` row when a count reaches the
  threshold and one `critical` row at 4×. Each key (hashed IP, user) is judged on its own count,
  so one key crossing is not hidden by the other already being past it.
- **`kind:"security"` accepts only the taxonomy.** Any `eventType` or `severity` string was
  stored — a made-up severity could dodge or fake the alert. Unknown values are now a `400`.
- **The rate limit is per visitor, not per calling server.** Every bearer route keyed its
  20/min limit on `cf-connecting-ip` — for the website server that is one IP for every visitor, so
  a busy page dropped CSP reports and could starve consent writes. A caller with a valid bearer now
  names the visitor in `x-client-ip` (`rateLimitKey`); without the bearer, or with a non-IP value,
  the header is ignored.
- **Tests no longer call Resend or Sanity for real.** The test pool loads `.dev.vars`; a real
  `RESEND_API_KEY` there made erasure and unsubscribe tests call the network and time out. The
  test config pins `RESEND_API_KEY` and `SANITY_API_WRITE_TOKEN` empty, as it already did for
  `CLERK_WEBHOOK_SECRET`.
- **The secret sync pushes only real secrets, for every app.** `secrets.mjs` now (1) reads both
  key registries, `.dev.vars.example` and `.env.example`, so a CI deploy of the website, admin or
  app syncs their declared secrets (it read only `.dev.vars.example`, which the Next apps lack or
  keep partial); (2) syncs a local key only when a registry declares it, so a dev tool key or a
  local-only URL never reaches a Worker; (3) skips any key `wrangler.toml` sets as a var for the
  target env, so a local `API_URL=http://localhost:8787` never overwrites the per-env origin.

- **A hand-run staging/prod deploy no longer pushes the dev secrets.** `secrets.mjs` read the
  local `.dev.vars` for every env, so `pnpm deploy:shared:api:prod` would have synced the dev
  Clerk key and the dev `GDPR_FINGERPRINT_SALT` to prod. Staging/prod now read only
  `.dev.vars.<env>` (now gitignored) or the CI env. `WEBSITE_URL` is set on dev + staging, so the
  erasure email links to the website's confirm page.

- **Clerk auth emails (verification codes) are sent again.** Two faults dropped every taken-over
  email: the webhook shared the 4 KB route cap, but Clerk's `email.created` payload holds the
  rendered HTML (~12 KB), so it answered 413; and the dispatch checked `emails.created`, a name
  Clerk never sends. The webhook now has its own 64 KB cap and matches `email.created`. The failure log now
  carries the error message (`resend 403` = sender domain not verified in Resend).

- **The deploy syncs every secret the api reads.** `CLERK_SECRET_KEY`, `SANITY_API_WRITE_TOKEN` and
  `TURNSTILE_SECRET` were missing from `.dev.vars.example` and from the CI deploy job's `env:`, so
  `secrets.mjs` never pushed them — a deployed export or self-erasure answered 503. Declared + passed
  now; `worker-secrets.test.mjs` fails if a Worker reads a secret it does not declare or CI does not
  pass.

### Fixed

- **"Download my data" and "Delete my account" work from the browser again.** `/v1/export` and
  `/v1/erasure/self` answered their CORS preflight with `PUBLIC_CORS_POST`, which does not allow the
  `authorization` header that carries the Clerk token — so the browser (website, app, and the app in
  the mobile WebView) dropped the request and the page showed "Something went wrong". They now use
  `PUBLIC_CORS_JWT` (allows `authorization`, exposes `X-Request-Id`), like the consent routes.

### Added

- **Data requests can be worked and answered.** `GET /v1/data-requests/:id` returns a request,
  its due date (one calendar month, GDPR Art. 12(3)) and its history; `POST
/v1/data-requests/:id/status` moves it (`new` → `in-progress` → `done` / `rejected`, no
  reopen), guarded on the status the operator saw (`409 changed`). History lives in the new
  `data_request_events` table (migration 0013, cascades with the request; notes encrypted like
  messages). Closing can email the operator's note to the requester; a mail failure keeps the
  change (`notified: false`). The intake now answers `{ ok, id }` and emails the requester a
  receipt. Both emails are en/fr, Studio-editable (`dataRequestReceipt`, `dataRequestClosed`).
- **Support footer in the recipient's language.** `supportFooter` now takes the locale: an
  English recipient reads "Need help?" instead of "Besoin d'aide ?" (erasure, data-request and
  Clerk emails).
- **The data-request routes are rate-limited.** The intake, the list, the detail and the status
  route now pass the native `RATELIMIT` check like every other bearer route (they skipped it).

- **The production contract (QA card 20).** Every response carries `X-Request-Id` (the `cf-ray`);
  every error is `{ error, message, requestId }`; a `rate_limited` 429 carries `Retry-After: 60` and
  `RateLimit-Policy: 20;w=60`; an uncaught throw is `500 internal` and a missing table
  `503 schema_behind` instead of a raw runtime 500. `POST /v1/events` accepts an `Idempotency-Key`
  from the server bearer (24 h replay, audit migration `0005`; the export is never stored — its
  answer is a live download link). Every outbound call (Resend, Sanity,
  Turnstile, Clerk) times out after 5 s. The authed `/health` reports both D1s (it only checked
  `AUDIT_DB`), the build the deploy stamps (`BUILD_VERSION`, `BUILD_COMMIT`) and the bindings. The
  `/v1` versioning policy is written ([API versioning](../../docs/shared/api/versioning.md)).

### Added

- **Admin actions on erasure requests and the cron.** `POST /v1/erasure-requests/:id/retry` re-runs a
  stuck (`confirmed`) request — the one case where a GDPR deadline could pass with no way to act; the
  subject's email comes from Clerk by user id, or — once that user is gone — is typed by the operator
  and checked against the fingerprint (never stored). A Clerk user who still exists under a changed
  email stops the retry (`409 clerk_email_changed`), and a Clerk outage is `503`, never a deleted user. `POST /v1/erasure-requests/:id/close` closes a request handled outside
  the system with a required note (`closed_manual`). `POST /v1/cron/run` runs a cron tick now over the
  new `CRON` service binding. The confirm route and the retry share one execution path
  (`erasure/execute.ts`).

### Fixed

- **Erasure runs never overwrite each other.** The final row update lands only if the request is
  unchanged since it was read: a manual close during a retry stands (`409 changed`), and of two
  concurrent retries or confirms only the first records the outcome and emails the subject.
- **A partial erasure emails the subject once.** A retry that still leaves a store failing no longer
  resends the completion email or a second audit row; the final full run sends the last email.
- **Run now fails cleanly.** `POST /v1/cron/run` answers `502 cron_unreachable` when the cron throws or
  answers non-JSON, instead of an uncaught 500.

### Added

- **`GET /v1/cron/status` + `GET /v1/erasure-requests`** (bearer-gated, read-only) for the admin
  "Scheduled jobs" and "Erasure requests" pages: the last 24 cron runs with a stale flag (no run in 2
  hours) and live erasure/export counts; open erasure requests by deadline with a computed state and
  no fingerprint or user id. Migrations `audit/0004_cron_runs` and `main/0012_erasure_breach_flagged`
  (applied by the api's deploy, which owns both D1s).

### Changed

- **Cloudflare observability is fully on.** Traces (10% sampled) and Issues (grouped production
  errors) join the Workers Logs in the top-level `wrangler.toml` `[observability]` block, which every
  env inherits. Wrangler is pinned to 4.143.0 (Issues needs ≥ 4.134). A test fails if a part is off.
- **The rate-limit binding is `RATELIMIT`** (was `AGENT_RATELIMIT`, a leftover from the removed
  agent worker). Same namespace ids, same routes — only the name. Takes effect on the next deploy.

### Fixed

- **Signed-in routes accept valid Clerk tokens again.** `@clerk/backend` v3 `verifyToken` returns the
  claims and throws on a bad token; the api read `{ data, errors }`, so `data` was always empty and
  every valid token got 401 — the legal sync (`/v1/consent/legal`), the marketing-email consent and
  the step-up routes. One helper now verifies for all of them (`src/auth/clerk-jwt.ts`), tested
  against the real library with a locally signed RS256 token. **Why:** found by the signed-in
  legal-banner QA; the route tests inject `authenticate`, so they never ran the real verify.

### Removed

- **`GET /v1/geo` and the `EVENTS_TOKEN` bearer.** Both existed only for the Expo app. `POST /v1/events`
  accepts only `APP_API_TOKEN` again — every caller is a first-party server (`session-log`, `consent-log`,
  `security-reports`). The web surfaces read `cf-ipcountry` themselves. The admin-route rate limiting from
  the 2026-09-21 hardening stays. **Runbook:** `wrangler secret delete EVENTS_TOKEN --env <env>` per env,
  and drop the `EVENTS_TOKEN` GitHub secret.
- **Announcement surface `mobile`.** `SURFACES = ["website", "app"]` — the Capacitor shell renders the app
  surface. `?surface=mobile` now returns 400. Stored Sanity announcements were migrated (`mobile` → `app`).

### Added

- **`GET`/`POST /v1/consent/legal`** — the authenticated legal re-acceptance endpoint (Clerk-JWT,
  keyed on `sub`). `GET` returns the caller's last-accepted policy version; `POST {version, surface?}`
  writes an append-only `consent_events` proof (`consent_type = 'legal_reaccept'`, idempotent per
  version) + the current-state cache `user_profiles.legal_acked_version` (migration `0011`). **Why:** so
  the "policies updated" banner follows a signed-in user across website · app · mobile — accept on one
  surface, cleared on all. Anonymous visitors keep their per-surface local deposit. Covered by
  `consent/legal.test.ts` (5 tests).

### Security

API security-hardening pass (audit 2026-09-11). One HIGH + four MED + a LOW batch; plan →
[`docs/superpowers/plans/2026-09-11-api-security-hardening.md`](../../../docs/superpowers/plans/2026-09-11-api-security-hardening.md).

- **HIGH (2026-09-21) — split the API bearer so the mobile bundle no longer ships the admin key.**
  `POST /v1/events` and every admin read/write route validated the SAME `APP_API_TOKEN`, and the
  mobile app bundles it (`EXPO_PUBLIC_*` is inlined into the binary) — so extracting it from the app
  yielded full admin-API access (read plaintext DSAR PII, forge `admin`/`consent` rows, `PUT
/v1/settings`). Now `/v1/events` accepts either the trusted `APP_API_TOKEN` (all kinds) OR a new
  least-privilege `EVENTS_TOKEN` (device telemetry — `session`/`security` kinds only, reads nothing);
  the ingest token is what the mobile app ships (`EXPO_PUBLIC_EVENTS_TOKEN`). A leaked ingest token
  can no longer write `admin`/`consent`/`csp-report` rows (403) or reach any read route (401). **Also
  (MED):** the admin bearer routes (`/v1/sessions`·`security`·`csp-reports`·`churn`·`settings`·
  `profiles/consent`·`data-requests`·`backups/status`) are now rate-limited too — they were not — via
  a shared `requireAdminBearer` + `rateLimit` guard that also dedupes the bearer block (was pasted 8×).
  **Runbook:** set a NEW `EVENTS_TOKEN` secret per env (`wrangler secret put EVENTS_TOKEN --env <env>`,
  DISTINCT from `APP_API_TOKEN`), and set `EXPO_PUBLIC_EVENTS_TOKEN` to that value on the mobile build;
  the old `EXPO_PUBLIC_API_TOKEN` is retired.
- **HIGH — the Clerk delete is now a required step on `/v1/erasure/confirm`.** The mailed-token
  RTBF path treated a failed Clerk delete (the one global session/credential kill-switch) as a benign
  `207` partial — sending the "erasure complete" email and spending the single-use token while the
  account was still live and the pseudonymised D1 fingerprint stayed re-linkable. It now retries the
  Clerk delete once and, on persistent failure, returns `502 {clerk_failed:true}`, keeps the row
  `confirmed` (not `completed`), and skips the completion email + `erasure.completed` audit — flagged
  for manual backfill, same contract as `/v1/erasure/self`. That self path also no longer emails
  "complete" on its own `clerk_failed` return.
- **MED — the in-worker rate limiter is bound and applied.** `AGENT_RATELIMIT` was commented out, so
  no in-worker limit fired anywhere — every public/token write leaned solely on the CF WAF `/api/*`
  rule. Bound per env (dev/staging/prod, distinct namespace_id) and applied to the routes that lacked
  it: `/v1/announcements`, `/v1/erasure/confirm`, and the two Clerk-JWT consent routes.
- **MED — `/v1/export` requires step-up reverification.** A full personal-data export ran on the JWT
  `sub` alone (`verifyToken` is networkless), so a revoked-but-unexpired token could exfiltrate the
  bundle within the access-token TTL. Export now enforces the same step-up as `/v1/erasure/self`, via
  one shared `authenticateClerkJwt` + `requireStepUp` gate (removing a verbatim `defaultAuthenticate`
  duplication).
- **MED — the public erasure-request fails closed with no abuse control.** `/v1/erasure/request`
  refuses (`503`) when neither Turnstile nor a rate limiter is configured, instead of running an
  unthrottled, unchallenged public POST (an email-bomb vector).
- **LOW — body-size re-check after read** on the remaining POSTs (`/v1/profiles/consent`,
  `/v1/settings` PUT, the consent routes, website `emails/test` + `consent-log`), and a **1-year
  expiry** on the no-login preference token (legacy no-`exp` tokens stay valid so old email links work).
- **LOW — churn free-text data minimisation.** `churn_events` free text (`feedback`/`competitor`, where
  a departing user can self-enter PII) is now scrubbed at a shorter window (new
  `retention.churn_freetext_days` setting, default 365) while the aggregate (`reason`/`deleted_at`) is
  kept to the 730-day `retention.churn_days` full-row purge — both in the cron retention pass. (The
  on-erasure scrub the plan first sketched was contradictory: self-erasure _writes_ the survey.)

**Accepted (documented risk, not changed):**

- **Audit `actor` is self-asserted by the bearer** (`/v1/settings` PUT, `/v1/events` admin) — by
  design (only the trusted website backend holds `APP_API_TOKEN` and does its own Clerk admin check),
  an audit-integrity note, not independently verified.
- **Lead-magnet download link** is signed + expiring but not single-use (a documented `ponytail:`
  ceiling).

**Runbook:** provision the `AGENT_RATELIMIT` namespaces and redeploy each env (`pnpm
deploy:shared:api:<env>`); the CF WAF `/api/*` rule stays the primary limiter. `/v1/export` now
returns a `403` reverification challenge to a stale session; `/v1/erasure/confirm` can return `502
clerk_failed`.

### Added

- **At-rest field encryption for `data_requests` PII (opt-in).** The DSAR table deliberately keeps a
  replyable plaintext `email` + free-text `message` (operational PII the operator answers). Cloudflare
  D1 already encrypts at rest, but a leaked dump or a read-access breach would expose those fields; with
  `PII_ENCRYPTION_KEY` set, the write path now AES-256-GCM-encrypts both (the existing, unused
  `@indiecrafts/packages-shared-security` `encrypt` helper) and the admin read decrypts. **Backward
  compatible:** unset key → plaintext as before, and the read handles legacy plaintext rows either way,
  so no migration or backfill is required. **Why:** defence-in-depth on the one place we store raw
  replyable PII — GDPR Art. 32 names encryption as an appropriate measure. (Lookup/erasure keys stay
  deterministic SHA-256 fingerprints, so matching still works; `user_profiles.email` stays plaintext by
  design — it is the email-keyed erasure lookup.)
- **Pre-migration snapshot now covers deploy-time migrations, plus a D1 revert tool.** A worker
  deploy applies its owned D1 migrations inline (`scripts/deploy/worker.mjs`); that path called
  `wrangler d1 migrations apply` directly and took NO backup, so `deploy:shared:api:prod` could alter
  the `audit`/`main` D1s unbacked. It now delegates each DB to `scripts/data/migrate.mjs`, so the same
  FAIL-CLOSED pre-migration R2 snapshot (schema + data) runs first — a failed snapshot aborts the
  deploy. And a new `scripts/data/restore.mjs` reverts a D1 to any minute in the last 30 days via
  Cloudflare Time Travel (`node restore.mjs <name>|--all <env> [--info] [--timestamp=|--bookmark=]`),
  the recovery counterpart to a bad migration/deploy (it pairs with CI's `wrangler rollback` for the
  code half). **Why:** never change a remote schema without a rollback net, and give one-command undo.
  Deploy environments now need R2-write + D1-export perms so the snapshot can run.
- **Welcome email on account creation.** The `user.created` Clerk webhook (`index.ts`, already
  handled for profile sync) now also sends a branded, localized welcome email — best-effort via
  `ctx.waitUntil`, only on `user.created`, in the sign-up locale (`unsafe.locale`), and it never
  throws so it can't affect profile sync. It is NOT a Clerk email template (Clerk has none), so it
  rides `user.created` rather than the `email.created` take-over; copy is editor-owned in the new
  `clerkEmails.welcome` Sanity group (translatable subject/intro/outro over a hardcoded en/fr
  fallback), with the same support footer + `bccAll` gating as the take-over emails
  (`clerk-email/welcome.ts`). **Why:** greet a new user distinctly from the sign-up verification code.
- **Clerk email take-over — every auth template, branded, localized, with a support address.** The
  `emails.created` take-over (`POST /v1/clerk-webhook` → `clerk-email/handle.ts`) now covers all 12
  auth/security email kinds (`verification`, `resetPassword`, `magicLink`, `newDevice`,
  `passwordChanged`, `passwordRemoved`, `passkeyAdded`, `passkeyRemoved`, `mfaEnabled`,
  `primaryEmailChanged`, `accountLocked`, `invitation`), up from 4. Copy is editor-owned in a new,
  separate `clerkEmails` Sanity singleton (moved out of `emailStrings`), translatable per kind, with a
  per-field fallback to the templates' hardcoded en/fr — a missing/unreachable Sanity never blocks a
  mandatory auth email. Every taken-over email — and both erasure emails — now shows the global
  editor-owned support address (`emailStrings.supportEmail`) in the footer, appended worker-safe
  (`renderEmailLayout` is `server-only`/Next-coupled, unusable in the bare Worker). An unknown slug
  still forwards Clerk's own body unchanged. The templates ship `delivered_by_clerk: true` (take-over
  dormant) until toggled off per the runbook. **Why:** own the auth-email experience — one brand, the
  recipient's language, and a support contact — without hard-coding copy or breaking mandatory sends.
  Setup + toggle + Google-screen steps → [Clerk emails](../../../docs/apps/web/config/clerk-emails.md).
- **Global blind copy on worker emails (`bccAll`), infra-gated.** The worker mailer (`erasure/email.ts`
  `resend`) merges an editor-owned `emailStrings.bccAll` (read alongside the copy in the same GROQ query)
  with the `EMAIL_ADMIN_BCC` env value, deduped — applied to both the Clerk take-over emails and the two
  erasure emails. The CMS `bccAll` is honored ONLY when `EMAIL_BCC_ALL_ENABLED` is set on the worker (a
  `[env.dev.vars]` value; never under staging/prod), so a Studio editor alone cannot silently blind-copy
  auth codes / magic links in production. **Why:** a live-editable QA copy without a CMS auth-bypass.
- **Churn tracking.** `POST /v1/erasure/self` (the authenticated self-service delete) now captures an
  optional exit survey (`reason`/`feedback`/`competitor`) into a new `churn_events` table (`main` D1,
  migration `0010`; `user_id` primary key, `deleted_at`, `reason`, `feedback`, `competitor` — no email,
  no name). It's the only writer; the GDPR erasure-request flow (`/v1/erasure/request` → confirm) never
  writes it and never suppresses — that flow stays a pure delete. After writing the row, the route
  suppresses the departing Resend contact (`suppressResendContact`: globally unsubscribed, opted out of
  every marketing topic, opted into a new **churned** Topic) instead of deleting it, so the business
  keeps a win-back cohort. The `clerk-deleted` webhook (`handleClerkUserDeleted`) now branches on
  `churn_events`: a row present suppresses the contact; no row falls back to the existing pure-delete
  (`deleteResendContact`) for the RTBF/admin carve-out. The churned Topic's id comes from Sanity —
  `fetchEmailPreferences` now also returns `churnedTopicId` + `optOutTopicIds`, read from a new
  `churned` field on the `emailPreferences` singleton. New bearer-gated `GET /v1/churn` returns
  `{ total, byDay, byReason, recentFeedback }` for the admin churn dashboard. **Why:** understand why
  self-service users leave (legitimate interest) without retaining PII beyond an opaque id and optional
  free text, and without touching the pure-delete GDPR path. Full model →
  [Churn tracking](../../../docs/apps/web/config/churn.md).
- **The Clerk delete is now a required step in self-erasure.** `POST /v1/erasure/self` retries a failed
  Clerk delete once inline before giving up; if it's still failing, the route returns `502` with
  `clerk_failed: true` instead of a success/partial status. The `erasure_requests` row stays
  `confirmed` (not `completed`) for manual backfill. **Why:** Clerk is the one global session
  kill-switch — a client must never treat a failed Clerk delete as safe to sign out from, since the
  session would still be live everywhere else.
- **`db.batch` atomicity for erasure + preference writes.** Three multi-write D1 paths now commit
  through `db.batch` instead of separate sequential `.run()` calls: the `d1-core` erasure adapter's
  `anonymize()` (`user_profiles` + `consent_events`), the `d1-audit` erasure adapter's `delete()`
  (`session_events` + `security_events`), and `writePreferences()`'s per-key pref + `consent_events`
  proof pair. **Why:** a mid-write failure could otherwise leave one row of a pair applied and its
  sibling missing.
- **`POST /v1/erasure/self` now bounds its body without trusting `content-length`.** The `4000`-byte cap
  was checked against the request's `content-length` header alone; a missing or lying header could skip
  it. The actual read body is now checked too. **Why:** a header a caller controls must never be the
  only bound on an authenticated write.

- **Per-category email preferences.** Editor-defined marketing categories (the `emailPreferences`
  Sanity singleton, read never-throwing via `consent/email-preferences-sanity.ts`, seeded `news`/
  `offers`/`partners`/`tips`) replace the single `marketing_email` flag. New `main` D1 table
  `email_preferences (user_id, category_key, granted, updated_at)` via migration `0009`, which also
  back-fills each existing user's legacy `marketing_email` into a `news` row; every write appends a
  `consent_events` proof (`consent_type = 'email_pref:<key>'`) and recomputes `marketing_email` as a
  derived "any category granted" cache. Three route pairs: Clerk-JWT
  `GET`/`POST /v1/consent/email-preferences`; a no-login `GET`/`POST /v1/email-preferences?token=`
  for an email link, signed with the new `EMAIL_PREF_SECRET`; and `POST /v1/email-preferences/unsubscribe?token=`,
  an RFC 8058 one-click target that always 200s. Each write best-effort mirrors the changed
  categories to Resend **Topics** (`syncContactTopics`, per-category `opt_in`/`opt_out`, matched by
  the category's `resendTopicId`) — never blocking the D1 write. Sign-up grants every category
  flagged `includeAtSignup` (falling back to `news`) when the sign-up opted into marketing. Erasure
  hard-deletes the user's `email_preferences` rows and deletes the Resend contact outright (no
  win-back list). **Why:** an editor-configurable, per-category opt-in with proof, instead of one
  all-or-nothing flag.

### Changed

- **Resend mirror moved to the global Contacts API.** Resend renamed Audiences to Segments and made
  Contacts global, so the four `resend-audience.ts` functions (`upsertResendContact`,
  `syncContactTopics`, `suppressResendContact`, `deleteResendContact`) no longer use the
  `/audiences/{id}/contacts` endpoints. They now POST `/contacts` (create, with inline fields +
  topics), and on an existing email PATCH `/contacts/{email}` for fields and the dedicated
  `PATCH /contacts/{email}/topics` (a bare `[{ id, subscription }]` array) for topics; delete is
  `DELETE /contacts/{email}`. The `RESEND_AUDIENCE_ID` var is gone — there is no audience id — and the
  mirror now degrades to no-op on `RESEND_API_KEY` alone. **Why:** the old audience-scoped endpoints
  return nothing on a migrated (Segments) account, so the consent/churn mirror silently no-op'd.
- **Prod domain set to `updates.indiecrafts.dev`.** `domains.mjs` + `infra/cloudflare/env/prod.tfvars`
  now name the real prod api host (was the `api.example.com` placeholder); `prod.tfvars` carries the
  step-by-step domain-setup runbook inline, and the Cloudflare `account_id` is filled on all three
  env tfvars. **dev + staging are unchanged** — both serve on `*.workers.dev` (`attach_domain = false`),
  so only prod gets a custom domain. **Why:** make the prod domain a filled-in, documented setup step
  instead of a bare placeholder.
- **`EMAIL_FROM` wired as `[vars]` on every env** — `no-reply@updates.indiecrafts.dev`, one
  Resend-verified sending domain for dev/staging/prod. The sender is independent of each env's worker
  host, so dev/staging (on `*.workers.dev`) send from the same address. Moved out of `.dev.vars` (was
  an unset secret) so it is not double-defined as both a var and a secret. **Why:** one domain to
  verify + one sender everywhere; requires `updates.indiecrafts.dev` verified in Resend before sends
  work.

### Removed

- **The AI agent worker + the hybrid (Electron) surface — deleted entirely.** Removed
  `code/shared/agent` (the worker), `code/packages/shared/agent`/`agent-client` (the core +
  client bricks), the whole `code/projects/hybrid` surface + its reserved package/module
  markers, and every reference: registry rows, root scripts (17), VS Code tasks, env vars, the
  CSP agent origin, the api CORS electron-renderer origin, the admin worker-health entry, the
  announcement `hybrid` surface, and the native CI's hybrid job. The mobile/hybrid bearer
  `AGENT_TOKEN`/`EXPO_PUBLIC_AGENT_TOKEN` (which also carries the api session-log auth) was
  **renamed** to `API_TOKEN`/`EXPO_PUBLIC_API_TOKEN`, not deleted. `AGENT_RATELIMIT` (the api's
  Cloudflare rate-limit binding, misnamed) is kept. **Why:** neither the agent nor the desktop
  app is part of the product going forward.

### Added

- **Clerk auth emails are now Studio-editable.** The four taken-over auth emails (verification code,
  password reset, magic link, new-device) contribute groups to the `emailStrings` singleton
  (`authVerification`/`authResetPassword`/`authMagicLink`/`authNewDevice`). `clerk-email/sanity.ts`
  reads them over GROQ (mirroring `erasure/email.ts`) and `clerk-email/templates.ts` renders the
  editable subject / intro / button label / outro in the **recipient's** locale, with per-field
  fallback to the hardcoded en/fr. An unset/unreachable Sanity, a blank field, or an `enabled: false`
  group all fall back — a mandatory auth email never breaks. **Why:** operators can now edit auth-email
  copy per locale in the Studio (the flagged follow-up to the email take-over).

- **The internal security-alert email is Studio-editable.** A new `securityAlert` group on the
  `emailStrings` singleton (`subjectPrefix` + `intro`, English, un-localized) is read over the same
  never-throws GROQ path (`security/alert.ts`), with an English fallback. It has **no `enabled`
  toggle** — a security alert can never be silenced from the Studio; the incident details stay
  structured and non-editable. **Why:** operators can reword the alert without a code change, but must
  never be able to turn it off.

- **Commercial-email consent (`marketing_email`).** A new `user_profiles.marketing_email` column
  (migration 0008; `NULL`/`0`/`1`) holds the current opt-in state; `consent_events` keeps the append-only
  proof. The `user.created` webhook mirrors the sign-up opt-in (Clerk `unsafe_metadata.marketing_email`) to
  the column **on insert only** (never clobbered on update) + writes a proof row. New Clerk-JWT
  `GET`/`POST /v1/consent/marketing-email` (the account toggle + the sign-in nudge) and bearer
  `POST /v1/profiles/consent` (the admin users-list column). Each decision mirrors to a Resend audience
  (`resend-audience.ts`, env `RESEND_AUDIENCE_ID`; unset → no-op); erasure **pure-deletes** the contact
  (no win-back list). All Resend syncs are best-effort (logged, never block the write). **Why:** capture a
  lawful, editable marketing opt-in and keep a marketing list in sync without building a sender.

### Changed

- **Erasure emails now render in the subject's locale.** `sendErasureTokenEmail` /
  `sendErasureCompleteEmail` take a `locale` and resolve the Studio copy per-locale (was default-locale
  only). Each caller reads `user_profiles.locale` for the recipient — folded into the request-form
  SELECT, or read (via `readProfileLocale`) **before** the erasure clears the profile row. Hard-coded
  English stays the last-resort fallback. **Why:** a French subject was getting the English erasure mail
  even when French Studio copy existed.

- **Clerk auth-email slug matching is forgiving + cached.** `clerk-email/sanity.ts` maps Clerk's
  (varying, partly undocumented) email slugs to our four kinds by substring (`authKind`) instead of an
  exact allow-list, so the real new-device slug resolves without guessing its exact string; the
  `emailStrings` read is cached in-worker for 5 min (auth emails fire on every sign-in). Both fall back
  safely — an unknown slug still forwards Clerk's own body; the cache is bypassed under an injected
  fetch (tests). **Why:** stop guessing the new-device slug, and stop re-fetching the singleton on every
  auth email.

- **Localized Clerk auth emails + `user_profiles.locale`.** The clerk-webhook mirrors the sign-up locale
  (Clerk `unsafe_metadata`, validated with `isLocale`) to `user_profiles.locale`, and a new
  `emails.created` branch takes over Clerk email delivery — rendering localized verification / reset /
  magic-link mail via Resend (reusing the worker-safe `erasure/email.ts` sender), and forwarding an
  unknown slug as Clerk's own English body (never dropped). Gated on the operator toggling "Delivered by
  Clerk" off + `RESEND_API_KEY`/`EMAIL_FROM` (a failure returns 502 so it is visible, never a silent
  drop). **Why:** Clerk's UI `localization` prop does not localize its emails.
- **Localized "sign in from a new device" security email.** A `newDevice` template joins the
  `emails.created` take-over — device / location details + the "sign out this device" revoke button
  **when** Clerk sends its link (else a "change your password" warning). An un-localized slug is
  logged (no PII) so the real Clerk slug can be locked. Enable "Sign in from new device" in the
  Clerk Dashboard, then toggle its delivery off to localize it. **Why:** the new-device alert should
  be in the user's language too.
- **Local dev now runs against the real remote Cloudflare `dev` D1/KV/R2 — the miniflare local
  tier is gone.** The `api` + `cron` `dev` scripts gained `--remote` (`wrangler dev --env dev
--remote`), so `pnpm dev` and `db:migrate:*:dev` share the one `dev` database. Removed the `local`
  migrate tier: `migrate.mjs` drops the `--local` branch (dev/staging/prod only, each still
  R2-snapshotted first), and the `db:migrate:{audit,core,all}:local` scripts + their
  `.vscode/tasks.json` entries are deleted. The local `.wrangler/state` is no longer used. _Why:_ one
  shared `dev` database is far more workable — a signed-up user shows up locally at once, no webhook
  detour or backfill guesswork. Trade-off: local dev now needs wrangler auth + a network, and the
  `dev` D1 is shared across developers (not isolated). See
  [local-development.md](../../docs/shared/architecture/local-development.md).

### Removed

- **Pruned the unused `@indiecrafts/packages-shared-agent` dependency** (agent logic now lives in
  the standalone `agent` worker).

### Added

- **Per-DB backup scripts for `core` + `audit`.** `db:backup:{core,audit}:{dev,staging,prod}`
  (+ `:remote` R2-upload variants) mirror the existing `db:backup:content:*` / `db:backup:all:*`
  pattern, so an operator can snapshot one D1 by name instead of only the whole registry via
  `--all`. Matching `.vscode/tasks.json` entries added (`check:tasks` stays green). Closes the
  last asymmetry the db-management plan left open. The local/dev/staging/prod tier-model table
  now also lives in [`platform-deploy.md`](../../docs/shared/architecture/platform-deploy.md),
  not only the `code/shared/db` brief.

### Fixed

- **`backfill-profiles.mjs` wrote to the wrong D1.** It executed the `user_profiles` upsert against
  binding `DB` (the `audit` firehose) instead of `CORE_DB` (where `user_profiles` lives), so
  `db:backfill:profiles:*` never worked. It now targets `CORE_DB` and runs `--remote` for every env.
- **Clerk `user.deleted` now runs the full erasure engine, not a partial pseudonymize.**
  `handleClerkUserDeleted` (`src/erasure/clerk-deleted.ts`) reads the stored email +
  fingerprint before the profile is pseudonymized, then runs `runErasure` with
  `buildErasureAdapters(env, { includeClerk: false })` (the user is already gone in
  Clerk) — so `session_events`, `security_events`, and Sanity docs are erased too, not
  just `user_profiles`. Writes an `erasure_requests` proof row + an `admin_audit`
  `erasure.clerk_deleted` row, mirroring `self.ts`. Falls back to the prior partial
  update when there is no profile/fingerprint to key the engine on.

### Changed

- **One `buildErasureAdapters(env, { includeClerk? })` factory replaces three duplicated
  adapter-assembly copies (`confirm.ts`, `self.ts`, `export/route.ts`).** `clerk` is
  included only when `includeClerk !== false` and the secret is set (the webhook path
  passes `includeClerk: false`); `sanity` is included only when all three of its secrets
  are present. Each caller's preflight still 503s before construction when a required
  secret is missing, so the assembled set is unchanged for every existing route.
- **Distinct-per-env `GDPR_FINGERPRINT_SALT` guidance.** The salt feeds
  `fingerprintEmail(email, salt)` — an identical salt across `dev`/`staging`/`prod` would
  make a lower-trust dev environment a correlation vector to de-pseudonymize prod
  identities. Guidance now calls for an independently-generated salt per env, stable
  within that env (rotating a live salt orphans every existing fingerprint lookup).

### Added

- **`POST /v1/erasure/self` enforces Clerk `fva` step-up (10-minute window).** A signed-in
  caller's session JWT alone let a raw API call erase an account with no recent factor
  reverification. The route now reads the Clerk `fva` claim and, when the first factor
  was verified more than 10 minutes ago (or `fva` is absent/not-applicable), returns
  Clerk's reverification-error response before the erasure engine runs.
- **`/v1` auth-contract test** — a table-driven test asserts every bearer/JWT-gated
  mutating `/v1` route rejects an anonymous request, closing the gap where `POST
/v1/events` had an auth gate but no anon-rejection test.

### Added

- **Cloudflare Terraform for every eligible surface (`code/**/infra/cloudflare`, `scripts/lib/infra-registry.mjs`).**
  Previously only `website` + `api` had edge stacks. Added self-contained stacks for **agent** (api-style
  edge for the AI Worker), **app** (website-style edge), **admin** (website edge **+ a Cloudflare Zero Trust
  Access SSO gate** — `access_email_domain` var), **storybook** (minimal: custom domain + zone hardening),
  and the **account**-altitude stack (`code/shared/infra/cloudflare/account` — account-wide config, mostly
  commented). All seven are registered in `infra-registry.mjs` (with apply order) and wired with
  `infra:<scope>:<name>:{init,plan,apply,output}:<env>` delegators + `.vscode/tasks.json` tasks. New
  `infra-registry.test.mjs` asserts every registered stack has a real dir + `main.tf` (guards the
  registered-but-empty case that left `account` a stub). **Ceiling:** several surfaces on ONE apex zone
  would fight over the single-per-zone rulesets — a `manage_zone_resources` gate is a documented TODO
  (`@debt MIGRATION`); until then, one zone per surface. See docs/infra/cloudflare-iac.md.
- **`agent` is in the CI wrangler dry-run (`.github/workflows/test.yml`).** The per-worker
  `wrangler deploy --dry-run` loop covered `api·cron·workers` but not `agent` (split out of api later);
  added it so the agent Worker config is validated in CI too.

- **`resources:teardown:<env>` — delete every Cloudflare resource an instance owns
  (`shared/scripts/infra/teardown.mjs` + `lib/resources.mjs`).** A dry-run-by-default cleanup for
  shipping the template clean (no leftover Workers / D1 / KV / R2 on the seller's account). "Anonymised":
  every name is DERIVED from the registries + the site prefix (`lib/resources.mjs` — the single source of
  truth for what a deploy creates), never a hard-coded id. `--yes` executes; prod re-confirms by typing
  the prefix; a missing resource is skipped, not fatal. Sibling `resources:<env>` prints the manifest
  (non-destructive). **Why:** a seller must wipe the demo instance before handing over the repo; deriving
  the list keeps it correct after any client rename. **Logged once here for the whole instance.**
- **Deploy now syncs secrets from `.dev.vars` after `wrangler deploy` (`shared/scripts/deploy/worker.mjs`
  - `next.mjs`).** Like wahio's `deploy-full`, every `deploy:<app>:<env>` runs the secrets step
    (`data/secrets.mjs --soft`) once the Worker exists — `--soft` no-ops when there is nothing to sync, so
    an app with no `.dev.vars` (admin/app today) never fails the deploy. `--skip-secrets` opts out.
    **Why:** one command deploys code AND pushes secrets; no separate `secrets:sync` step to forget.
    **Logged once here for every worker + next-cf surface.**
- **`secrets:sync:api:<env>` — bulk-push secrets from `.dev.vars` (`shared/scripts/data/secrets.mjs`).**
  A shared, registry-driven runner (the worker twin of the website's `sync-secrets`): reads the Worker's
  `.dev.vars`, drops comments / blanks / `NEXT_PUBLIC_*` / placeholders, and `wrangler secret bulk`s the
  rest in one call (clobber-guarded, prod-confirmed). Root alias `secrets:sync:shared:api:<env>`. **Why:**
  the api has several secrets (`APP_API_TOKEN`, `IP_HASH_SALT`, `SANITY_API_READ_TOKEN`, …) — one command
  instead of N × `wrangler secret put`.

### Changed

- **KV namespaces are named on the shared convention (`shared/scripts/infra/bindings.mjs`).** The
  provisioner now creates a KV namespace as `<prefix>-<env>-<owner-tail>-<binding>` (e.g.
  `indiecrafts-<env>-shared-api-security-counters`) instead of the off-convention `<BINDING>_<env>`,
  coherent with Workers / Pages / D1. **Why:** one naming law across every Cloudflare resource, so a
  client rename swaps only the prefix. (D1/queue keep their short create-name; the `database_name` in
  `wrangler.toml` is authoritative there.)

### Fixed

- **Infra stack polish (admin/storybook markers + tfvars).** admin's Zero Trust Access resources are now
  `count`-gated on `attach_domain` (inert on `*.workers.dev`, so `dev` is apply-clean like the other
  zone-scoped resources); storybook `staging.tfvars` set `attach_domain = false` to match its
  `wrangler.toml` (`[env.staging] workers_dev = true`); the copied `.claude`/`aws`/`vercel` scope-path
  markers in the app/admin infra dirs were retargeted off `website`.
- **`pnpm clean` actually cleans again (`shared/scripts/dev/clean.sh`).** After the script moved to
  `code/shared/scripts/dev/`, its `ROOT_DIR="$(dirname "$SCRIPT_DIR")"` resolved to
  `code/shared/scripts` (one level up), so `find .` ran there and matched **no** app artifacts —
  `clean` printed "Clean complete" while deleting nothing. Now resolves the git top-level
  (`git rev-parse --show-toplevel`), move-proof. **Why:** a stale `.next/dev/types` survived every
  `clean` and broke `tsc`/`build:cf` after a route rename. Logged here for the shared toolchain.
- **`recordBackupRun` logs backup runs again (`shared/scripts/lib/backup-common.mjs`).** The
  `wrangler d1 execute` that writes the `backup_runs` row ran bare `wrangler` on the default PATH — but
  `backup.mjs` puts the owner's `node_modules/.bin` on PATH only per-spawn (`ownerEnv()`), which
  `recordBackupRun` never inherited, so `wrangler` was ENOENT and every run warned "failed — not logged"
  (the backup export itself still succeeded). It now augments PATH the same way (it already `chdir`s to the
  api dir). That uncovered a **second** bug: `env` is a separate `recordBackupRun` param, not part of the
  `run` object, and wasn't merged into the INSERT — so `backup_runs.env` was NULL and hit its NOT NULL
  constraint. Now merged (`buildBackupRunInsert({ ...run, env })`). Verified against remote dev D1.
  **Why:** `/v1/backups/status` + the admin Backups screen read `backup_runs`; without the row
  they show no runs even though data was safely backed up.
- **Public `vars` are declared per env, not top-level (`wrangler.toml`).** `SANITY_API_VERSION`,
  `BACKUP_BUCKET`, and `BACKUP_RETENTION_DAYS` sat under a top-level `[vars]` — which wrangler does **not**
  inherit into named environments (it warns and drops them), so every `--env dev|staging|prod` deploy
  shipped **without** them. Moved into `[env.<env>.vars]` (with an env-specific
  `BACKUP_BUCKET = <prefix>-<env>-db-backup`); the top-level block is gone. **Why:** the api was deploying
  without its runtime vars — the backup bucket, Sanity API version, and retention were all unset in prod.
- **`pnpm dev` local fleet no longer collides (covers `api`/`agent`/`cron`/`workers`).** All four
  bare workers ran `wrangler dev` on the default inspector port 9229, so only one could start and
  the rest crashed with `Address already in use`, aborting the whole `turbo run dev`. Each worker's
  `dev` script now pins a distinct `--port` (8787-8790) and `--inspector-port` (9229-9232), and the
  root `pnpm dev` is scoped to `website + api + agent + cron + workers` (the `admin`/`app`/`hybrid`
  surfaces are run individually). Logged once here for the whole worker fleet.

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
