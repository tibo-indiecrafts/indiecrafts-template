---
title: "Data retention + audit (GDPR)"
description: "The auth work adds an EU-resident audit + session-activity + security store, now split across two Cloudflare D1 databases, both --location weur, both owned b…"
status: stable
---

# Data retention + audit (GDPR)

The auth work adds an **EU-resident audit + session-activity + security store**, now split
across **two** Cloudflare D1 databases, both `--location weur`, both owned by the `api`
worker: **`audit`** (binding `AUDIT_DB`) — the append-only firehose (`admin_audit`,
`session_events`, `security_events`, `csp_reports`, `backup_runs`); **`main`** (binding
`MAIN_DB`) — identity/rights/settings (`user_profiles`, `consent_events`, `data_requests`,
`erasure_requests`, `export_requests`, `site_settings`). The split isolates a firehose
write-spike or schema change from identity data. This page is the record-of-processing and
the **privacy-policy disclosure checklist** an operator must action. Design:
`docs/superpowers/specs/2026-08-21-audit-sessions-d1-eu-design.md` (original) and
`docs/superpowers/specs/2026-08-25-audit-db-split-design.md` (the core/audit split).

## What is processed

| Table             | Written when                                                                     | Fields                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin_audit`     | an admin grants/revokes the `admin` role                                         | timestamp, event, actor userId, target userId, country (`cf-ipcountry`) — **no IP**                                                                                        |
| `session_events`  | a user signs in on a surface                                                     | timestamp, surface, userId, country, **hashed IP** (salted SHA-256, never raw)                                                                                             |
| `security_events` | an app-level security incident (failed-login threshold, privilege escalation, …) | timestamp, event type, severity, surface, userId (when known), country, **hashed IP**, a short label — never PII free-text; a webhook's message id when the source retries |

All three tables above live in the **`audit`** D1 (binding `AUDIT_DB`).

- **Where:** Cloudflare **D1 in the EU** (`--location weur`) — data stays in-region. Two
  databases (`audit` + `main`), not one, isolate the high-volume firehose from
  identity/rights data; each env (dev/staging/prod) provisions both, so the free-plan D1
  count is envs × 2 = 6 — verify against current Cloudflare D1 plan limits.
- **Minimization (Art. 5(1)(c)):** country code + a _hashed_ IP; no raw IP, no
  user-agent, no free text.
- **Retention (Art. 5(1)(e)):** **90 days**, enforced by the `cron` worker's hourly purge.
- **Lawful basis:** legitimate interest — securing accounts + an admin audit trail.
- **Processors:** Cloudflare (D1 hosting, EU) and Clerk (authentication).

## Retention windows are now admin-overridable

Every retention window on this page — plus the erasure-SLA warning lead time — is now a
runtime setting an operator can change from the admin **Settings** card, bounded and
audited, instead of a code change + redeploy: `retention.audit_days` (90), `retention.
consent_days` (1095, 3-year floor), `retention.erasure_request_days` (1095, 3-year floor),
`retention.data_request_days` (365), `retention.profile_anonymized_days` (90),
`retention.csp_days` (30), and `ops.sla_warning_days` (7). The **values on this page are the version-controlled defaults and the disclosed
baseline** — unchanged by this — and the 3-year proof floors on consent/erasure can only be
raised, never lowered. An empty settings table behaves identically to today. Full detail
(the settings registry, the guardrail model, the match-by-reader framing) →
[Admin settings](/projects/web/website/config/settings).

::: warning Privacy-policy drift
The 90-day audit window, the 3-year consent window, and the 3-year erasure-request window
are **disclosed to data subjects** (see the checklist below). Raising or lowering
`retention.audit_days`, `retention.consent_days`, or `retention.erasure_request_days` from
the Settings card silently drifts that disclosure unless the privacy policy is updated in
the same change — the Settings card shows an inline reminder next to each, but it's a
nudge, not enforcement.
:::

## Consent log (consent_events)

- **Where:** `main` D1 (binding `MAIN_DB`).
- **What:** every cookie-consent decision, one row per consent type, account-scoped
  (linked to the erasure fingerprint) or anonymous (consent_id cookie, only when
  `features.compliance.logAnonymousConsent` is on).
- **Retention:** ~3 years (`CONSENT_RETENTION_DAYS = 1095`), purged by the cron —
  longer than the 90-day audit tables because consent is a proof record.
- **Erasure:** keyed by `subject_id` (user id) and `email_fingerprint`.

## DSAR intake (data_requests)

**Where:** `main` D1 (binding `MAIN_DB`, migration 0006). The GDPR data-subject request
form (Art. 15–21) now writes to a `data_requests` D1 table instead of Sanity. The public
form, the `/api/data-request`
route (Turnstile, rate limit, origin check, body cap), and the owner-alert email are
**unchanged** — only the persistence moved. `POST /v1/data-request` (bearer-gated)
inserts a row; operators view requests in the admin "Data requests" screen, backed by
`GET /v1/data-requests` (bearer-gated), newest-first.

- **Fields:** request type, a **plaintext, replyable email**, an optional **free-text
  message** (≤4000 chars), status (`new`/`in-progress`/`done`/`rejected`), submitted-at,
  source page, locale, policy version.
- **History (`data_request_events`, migration 0013):** one row per operator move — status,
  an optional note (operational PII, encrypted like `message`), the admin's Clerk id, whether
  the closing email went out, the time. Rows cascade with their request, so the 365-day
  purge removes both.
- **Deliberate PII departure:** unlike the minimized tables above (country + hashed IP,
  no free text), `data_requests` stores real, replyable operator-facing PII. This is
  intentional — the operator needs the plaintext email and message to action the
  request, exactly as the Sanity `dataRequest` doc did before this migration.
- **At-rest encryption (optional, Art. 32):** with `PII_ENCRYPTION_KEY` set, `email` and
  `message` are **AES-256-GCM-encrypted** at the application layer (on top of D1's own
  at-rest encryption) — so a leaked D1 dump or a read-access breach sees ciphertext, not
  the subject's email/message; the admin read decrypts. Unset → plaintext, backward
  compatible (legacy rows still read). Lookup keys elsewhere stay deterministic
  fingerprints; this table has none, so encrypting it is lossless.
- **Retention:** **365 days** (`DATA_REQUEST_RETENTION_DAYS = 365`), on `submitted_at`,
  purged by the cron — this is short-lived operational PII, not a tracking signal. A
  year gives the operator room to action and prove the request before it is purged.
- **Status write-back:** the admin screen is read-only for now — flipping `status`
  (new/in-progress/done) from the UI is a **deferred follow-up**. Meanwhile, flip it
  via `wrangler d1 execute UPDATE data_requests SET status = ? WHERE id = ?`.
- **Sanity `dataRequest`:** the schema is now **deprecated** — the Studio desk list
  shows it as "[Déprécié] Demande RGPD" — kept read-only for one cycle so historical
  and in-flight requests captured before the migration stay readable, then removed.

## Erasure SLA flag (GDPR Art. 12(3))

An erasure request must be actioned within **one month** (`erasure_requests.due_at`,
`main` D1, binding `MAIN_DB`). The cron's `erasure_sla` pass (hourly) first closes **lapsed**
requests — never confirmed, confirmation link expired — as `expired`: an unverified request
cannot be actioned, so it is closed, not flagged. It then flags each **open** request
(confirmed, or awaiting confirmation with a live link) at most twice:

- **Due soon** (`due_at` within `ops.sla_warning_days`, default 7): a `security_events` row
  (`audit` D1, binding `AUDIT_DB`), `erasure_sla_due` / `medium`, once (`due_flagged_at`).
- **Breached** (`due_at` already past): a `security_events` row, `erasure_sla_breach` /
  `high`, once (`breach_flagged_at`) — so a request warned about earlier is still escalated
  when the deadline passes.

A request stays `confirmed` when a store failed — always when the Clerk delete failed after its
inline retry — and neither the subject (single-use link) nor the cron can finish it. The admin
**Retry** re-runs it (the subject's email from Clerk, or typed by the operator and checked against the
fingerprint, never stored); **Close manually** records a request handled outside the system
(`closed_manual`, with a required note kept on the row). `completed`/`cancelled`/`expired`/
`closed_manual` requests are skipped. The admin **Erasure requests** page
lists open requests by deadline; the **Scheduled jobs** page shows each run's counts. The flag itself no-ops until the
cron's `MAIN_DB` binding is bound; the `security_events` audit row additionally needs `AUDIT_DB`
bound — `due_flagged_at` still gets set on `MAIN_DB` even if `AUDIT_DB` isn't. Owner-reminder
email is deferred — the cron has no email sender.

- **Retention:** **1095 days** (~3 years, `ERASURE_REQUEST_RETENTION_DAYS = 1095`), on
  `requested_at`, purged by the cron — the same window as `consent_events`, because a
  completed request is a proof-of-erasure record, not an audit trail.

## Export-bundle cleanup

`POST /v1/export` bundles expire after **1 hour** (`export_requests.expires_at`, `main` D1,
binding `MAIN_DB`) and are deleted from R2 on first download. The cron's scheduled handler
sweeps the rest: any `export_requests` row whose TTL passed unread has its R2 object
(`EXPORT_BUCKET`) and its row deleted. Idempotent; reports `skipped` until both `MAIN_DB` and
`EXPORT_BUCKET` are bound. The cron binds the bucket in every env the api does (`pnpm
test:scripts` enforces it); the admin **Scheduled jobs** page shows "expired exports not yet
deleted" so a stalled cleanup is visible.

## Cron run history

Every hourly tick writes one `cron_runs` row (`audit` D1): timings, `ok`/`failed`, and each
pass's counts plus an error **name** or skip reason — no personal data. Purged at
`retention.audit_days` (90 days, about 2,160 rows).

## Idempotency keys

A retried `POST /v1/events` with the same `Idempotency-Key` replays the stored answer instead of
writing a second row. `idempotency_keys` (`audit` D1) holds a SHA-256 of the caller's bearer and of
the request body, plus the route's answer (`{ "ok": true }`) — never the request itself. Only the
server bearer can create a row. The cron's `audit_purge` deletes rows after **24 hours**. The data
export is never stored here: its answer carries a live download link.

## Global admin BCC (transactional email)

Setting `EMAIL_ADMIN_BCC` (an env var, read by both send layers) copies **every**
transactional email to one admin/DPO address:

- **Website** (`@indiecrafts/packages-web-email`'s `sendEmail`) — merges it into the
  outgoing `bcc` for every email sent through the brick: newsletter, contact, waitlist,
  lead magnet, comment notifications, and the data-request owner alert. Deduped against
  any per-group bcc the caller passed — a Studio-configured group bcc still composes,
  it never gets overwritten.
- **`api` worker** (`code/shared/api/src/erasure/email.ts`) — its own `EMAIL_ADMIN_BCC`
  adds a `bcc` to the two erasure emails (token confirmation + completion).

Unset on either layer → no admin bcc there, no behavior change.

## Cookie audit (operator)

Before go-live, enumerate every real cookie/tracker the site sets into Sanity
`cookieEntry` rows (name, provider, category, purpose, duration, party), so the
`CookieDeclaration` table is accurate. Gate every third-party embed (YouTube, maps,
fonts) behind `<ConsentGate category="marketing">`. This is a content + review task,
not code.

## Erasure (Art. 17)

On a data-subject **erasure** request (the DSAR form → `data_requests`, above), purge
the subject's rows. This manual block matches the engine policy below. It does not
blanket-delete `security_events`; the engine pseudonymises high/critical rows and
deletes the rest. `session_events`/`security_events` live on the **`audit`** D1;
`consent_events` lives on the **`main`** D1 — run each block against its own database:

```sql
-- audit D1 (indiecrafts-<env>-db-audit)
DELETE FROM session_events  WHERE user_id = ?;
DELETE FROM security_events WHERE user_id = ? AND severity NOT IN ('high', 'critical');
UPDATE security_events SET user_id = ? WHERE user_id = ? AND severity IN ('high', 'critical');
```

```sql
-- main D1 (indiecrafts-<env>-db-main)
UPDATE consent_events SET subject_id = ?, subject_type = 'visitor' WHERE subject_id = ?;
```

`admin_audit` is **retained**, not deleted — it is the accountability trail (see the
erasure-engine policy table below).

The manual `consent_events` step above closes a gap noted in Phase 2: the row already
carries `email_fingerprint`, so erasure pseudonymises `subject_id` to that fingerprint
instead of deleting the row. The erasure engine below does this automatically.

Run via `wrangler d1 execute indiecrafts-<env>-db-audit --command "…"` (audit) or
`wrangler d1 execute indiecrafts-<env>-db-main --command "…"` (main). Security
audit records _may_ be retained under legitimate interest where law allows — document
the operator's decision per request.

## Erasure engine

`runErasure`/`runExport` (`@indiecrafts/packages-shared-compliance/shared`) orchestrate
erasure across every store. The orchestrator is store-agnostic: it takes an array of
`ErasureAdapter` and runs each one, so no single runtime holds every store's secret.
A store can never be silently skipped — the receipt enumerates every adapter, even one
that errors.

`code/shared/api/src/erasure/d1.ts` implements two adapters — `createCoreErasureAdapter`
(store id `d1-core`) and `createAuditErasureAdapter` (store id `d1-audit`, which takes a
**read-only handle to `main`** to resolve `user_id` before scrubbing `audit` rows — a
lookup-then-use, not a cross-DB join or transaction):

| Adapter    | Store                        | Policy                                                                                                                                                                                        |
| ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `d1-core`  | `user_profiles`              | pseudonymise (scrub email/name, keep the fingerprint); the cron then **hard-deletes** the row after `retention.profile_anonymized_days` (90) — dropping the fingerprint = final anonymisation |
| `d1-audit` | `session_events`             | delete (low-sensitivity sign-in activity)                                                                                                                                                     |
| `d1-audit` | `security_events`            | delete low/medium severity; pseudonymise high/critical (`user_id`→fingerprint)                                                                                                                |
| `d1-core`  | `consent_events`             | pseudonymise (`subject_id`→fingerprint, `subject_type`→`visitor`)                                                                                                                             |
| `d1-audit` | `admin_audit`                | retain (the accountability trail)                                                                                                                                                             |
| `clerk`    | the Clerk user               | delete (Clerk holds identity + credentials — there is no pseudonymised form)                                                                                                                  |
| `sanity`   | `subscriber`/`waitlistEntry` | pseudonymise (email replaced by its fingerprint)                                                                                                                                              |
| `orders`   | future commerce D1           | no-op seam — orders/invoices carry a 7–10y anonymised retention duty, deferred until checkout ships                                                                                           |

`runErasure`/`runExport` run five adapters (`d1-core`, `d1-audit`, `clerk`, `sanity`,
`orders`) — one more than before the D1 split, a no-op change for the orchestrator, which already
reports per-store. Every adapter supports a **dry run**: `preview()` reports what an
erasure would touch without mutating anything, so an operator can inspect the blast radius
before confirming. `runExport` (Art. 15/20) reads every store the same way, keyed by email.

## Live erasure flow

Four routes on the `api` worker (`code/shared/api/src/erasure/`) drive the engine live:

- `GET/POST /v1/erasure/request` — the subject submits their email; a matched subject
  gets an emailed confirmation token (anti-enumeration: the response never reveals a
  match).
- `GET/POST /v1/erasure/confirm` — the subject opens the emailed link and types their
  email again; a valid token + matching email runs `runErasure` for real.
- `GET /v1/erasure/status/:token` — a public, no-PII poll of the request's lifecycle
  state (`status`, `requested_at`, `due_at`, `completed_at`) by the same token.
- `POST /v1/erasure/self` — the authenticated self-service path. A signed-in user
  erases from their profile's auth section: the Clerk session JWT proves identity, a
  typed email confirms the intent, and the engine runs directly (no email round-trip).
- `POST /v1/export` — the authenticated data-export path (Art. 15/20). The Clerk
  session JWT proves identity, `runExport` reads every store, and the bundle is
  written to the `EXPORT_BUCKET` R2 bucket. The response is a single-use download
  link that expires after **1 hour**. `GET /v1/export/download?token=` verifies the
  token (hashed, single-use, same pattern as the erasure confirm token), streams the
  bundle, and **deletes it from R2** on that first download — a second attempt with
  the same token, or an expired one, is refused.

## Erasure completeness & backups

Erasure runs on the live EU D1s and R2 objects — never on a backup.

Cloudflare D1 **Time Travel** keeps a rolling point-in-time history, up to 30 days.
You cannot edit or delete one record inside that history.

The compliant posture (ICO/EDPB guidance) is to treat backup PII as **beyond use**:
never mine it, never restore a backup to delete one record, and let it age out on
its own cycle.

**After a restore:** re-run the erasure engine (`runErasure`) for every erasure
request completed since the snapshot's timestamp. This stops a restore from
resurrecting data that was already erased.

**R2 export bucket:** keep object-versioning off on `EXPORT_BUCKET`. If versioning
is on, the same beyond-use posture applies to old object versions — never mine
them, let them age out on their own cycle.

See [Breach response](/projects/web/website/config/breach-response) for the containment procedure this
supports.

## Privacy-policy disclosure — operator checklist

The privacy policy (Sanity → Studio, per client) **must** now disclose:

- [ ] That sign-ins and admin actions are **logged** for security.
- [ ] The **data**: timestamp, surface, userId, country, a hashed IP (no raw IP).
- [ ] The **retention**: 90 days (the default — [admin-overridable](/projects/web/website/config/settings), reflect
      the actual live value if changed).
- [ ] The **lawful basis**: legitimate interest (account security + audit).
- [ ] The **location**: Cloudflare D1 in the EU.
- [ ] The **processors**: Cloudflare + Clerk (link their DPAs).
- [ ] How to exercise **erasure/access** — the existing data-request form.
- [ ] Re-check this checklist any time `retention.audit_days`, `retention.consent_days`, or
      `retention.erasure_request_days` changes in the admin Settings card.

Before `POST /v1/erasure/request` goes live, the operator must also:

- [ ] Arm `TURNSTILE_SECRET`, the bot gate. It fails **open** when unset.
- [ ] Bind `RATELIMIT`, the rate limit.

Without both, an attacker can email-bomb a known subject through the public form.

This template ships the schema + mechanism; the **prose is per-client** and is authored
in the Studio legal pages, not in code.

## Issue tags

- `@debt SECURITY` — retention is enforced by the cron purge; verify it runs once the
  operator binds `AUDIT_DB` + `MAIN_DB` + the schedule.
