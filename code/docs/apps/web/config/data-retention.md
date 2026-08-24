# Data retention + audit (GDPR)

The auth work adds an **EU-resident audit + session-activity + security store** — one
Cloudflare D1 (`binding DB`), three tables. This page is the record-of-processing and the
**privacy-policy disclosure checklist** an operator must action. Design:
`docs/superpowers/specs/2026-08-21-audit-sessions-d1-eu-design.md`.

## What is processed

| Table             | Written when                                                                     | Fields                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `admin_audit`     | an admin grants/revokes the `admin` role                                         | timestamp, event, actor userId, target userId, country (`cf-ipcountry`) — **no IP**                                        |
| `session_events`  | a user signs in on a surface                                                     | timestamp, surface, userId, country, **hashed IP** (salted SHA-256, never raw)                                             |
| `security_events` | an app-level security incident (failed-login threshold, privilege escalation, …) | timestamp, event type, severity, surface, userId (when known), country, **hashed IP**, a short label — never PII free-text |

- **Where:** Cloudflare **D1 in the EU** (`--location weur`) — data stays in-region. One
  database, not three, keeps the free-plan D1 count low; the tables stay isolated.
- **Minimization (Art. 5(1)(c)):** country code + a _hashed_ IP; no raw IP, no
  user-agent, no free text.
- **Retention (Art. 5(1)(e)):** **90 days**, enforced by the `cron` worker's daily purge.
- **Lawful basis:** legitimate interest — securing accounts + an admin audit trail.
- **Processors:** Cloudflare (D1 hosting, EU) and Clerk (authentication).

## Consent log (consent_events)

- **What:** every cookie-consent decision, one row per consent type, account-scoped
  (linked to the erasure fingerprint) or anonymous (consent_id cookie, only when
  `features.compliance.logAnonymousConsent` is on).
- **Retention:** ~3 years (`CONSENT_RETENTION_DAYS = 1095`), purged by the cron —
  longer than the 90-day audit tables because consent is a proof record.
- **Erasure:** keyed by `subject_id` (user id) and `email_fingerprint`.

## DSAR intake (data_requests)

The GDPR data-subject request form (Art. 15–21) now writes to a `data_requests` D1
table (migration 0007) instead of Sanity. The public form, the `/api/data-request`
route (Turnstile, rate limit, origin check, body cap), and the owner-alert email are
**unchanged** — only the persistence moved. `POST /v1/data-request` (bearer-gated)
inserts a row; operators view requests in the admin "Data requests" screen, backed by
`GET /v1/data-requests` (bearer-gated), newest-first.

- **Fields:** request type, a **plaintext, replyable email**, an optional **free-text
  message** (≤4000 chars), status (`new`/`in-progress`/`done`), submitted-at, source
  page, locale, policy version.
- **Deliberate PII departure:** unlike the minimized tables above (country + hashed IP,
  no free text), `data_requests` stores real, replyable operator-facing PII. This is
  intentional — the operator needs the plaintext email and message to action the
  request, exactly as the Sanity `dataRequest` doc did before this migration.
- **Retention:** this is short-lived operational PII, not a tracking signal — it must
  not accumulate indefinitely once a request is `done`. Purge-after-done plus a window
  is a **future cron follow-up**, not yet built; until then, action requests promptly
  and purge manually via `wrangler d1 execute`.
- **Status write-back:** the admin screen is read-only for now — flipping `status`
  (new/in-progress/done) from the UI is a **deferred follow-up**. Meanwhile, flip it
  via `wrangler d1 execute UPDATE data_requests SET status = ? WHERE id = ?`.
- **Sanity `dataRequest`:** the schema is now **deprecated** — the Studio desk list
  shows it as "[Déprécié] Demande RGPD" — kept read-only for one cycle so historical
  and in-flight requests captured before the migration stay readable, then removed.

## Erasure SLA flag (GDPR Art. 12(3))

An erasure request must be actioned within **one month** (`erasure_requests.due_at`). The
cron's scheduled handler flags a request once, as it nears or misses that deadline:

- **Due soon** (`due_at` within 7 days): a `security_events` row, `erasure_sla_due` /
  `medium`.
- **Breached** (`due_at` already past): a `security_events` row, `erasure_sla_breach` /
  `high`.

A flagged request gets `due_flagged_at` set, so a later tick does not repeat it.
`completed`/`cancelled`/`expired` requests are skipped. No-ops until the cron's `DB`
binding is bound. Owner-reminder email is deferred — the cron has no email sender.

## Export-bundle cleanup

`POST /v1/export` bundles expire after **1 hour** (`export_requests.expires_at`) and are
deleted from R2 on first download. The cron's scheduled handler sweeps the rest: any
`export_requests` row whose TTL passed unread has its R2 object (`EXPORT_BUCKET`) and its
row deleted. Idempotent; no-ops until both `DB` and `EXPORT_BUCKET` are bound.

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
deletes the rest:

```sql
DELETE FROM session_events  WHERE user_id = ?;
DELETE FROM security_events WHERE user_id = ? AND severity NOT IN ('high', 'critical');
UPDATE security_events SET user_id = ? WHERE user_id = ? AND severity IN ('high', 'critical');
UPDATE consent_events SET subject_id = ?, subject_type = 'visitor' WHERE subject_id = ?;
```

`admin_audit` is **retained**, not deleted — it is the accountability trail (see the
erasure-engine policy table below).

The manual `consent_events` step above closes a gap noted in Phase 2: the row already
carries `email_fingerprint`, so erasure pseudonymises `subject_id` to that fingerprint
instead of deleting the row. The erasure engine below does this automatically.

Run via `wrangler d1 execute indiecrafts-<env>-shared-api --command "…"`. Security
audit records _may_ be retained under legitimate interest where law allows — document
the operator's decision per request.

## Erasure engine

`runErasure`/`runExport` (`@indiecrafts/packages-shared-compliance/shared`) orchestrate
erasure across every store. The orchestrator is store-agnostic: it takes an array of
`ErasureAdapter` and runs each one, so no single runtime holds every store's secret.
A store can never be silently skipped — the receipt enumerates every adapter, even one
that errors.

`code/shared/api/src/erasure/` implements the adapters:

| Adapter  | Store                        | Policy                                                                                              |
| -------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `d1`     | `user_profiles`              | pseudonymise (scrub email/name, keep the fingerprint)                                               |
| `d1`     | `session_events`             | delete (low-sensitivity sign-in activity)                                                           |
| `d1`     | `security_events`            | delete low/medium severity; pseudonymise high/critical (`user_id`→fingerprint)                      |
| `d1`     | `consent_events`             | pseudonymise (`subject_id`→fingerprint, `subject_type`→`visitor`)                                   |
| `d1`     | `admin_audit`                | retain (the accountability trail)                                                                   |
| `clerk`  | the Clerk user               | delete (Clerk holds identity + credentials — there is no pseudonymised form)                        |
| `sanity` | `subscriber`/`waitlistEntry` | pseudonymise (email replaced by its fingerprint)                                                    |
| `orders` | future commerce D1           | no-op seam — orders/invoices carry a 7–10y anonymised retention duty, deferred until checkout ships |

Every adapter supports a **dry run**: `preview()` reports what an erasure would touch
without mutating anything, so an operator can inspect the blast radius before
confirming. `runExport` (Art. 15/20) reads every store the same way, keyed by email.

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

## Privacy-policy disclosure — operator checklist

The privacy policy (Sanity → Studio, per client) **must** now disclose:

- [ ] That sign-ins and admin actions are **logged** for security.
- [ ] The **data**: timestamp, surface, userId, country, a hashed IP (no raw IP).
- [ ] The **retention**: 90 days.
- [ ] The **lawful basis**: legitimate interest (account security + audit).
- [ ] The **location**: Cloudflare D1 in the EU.
- [ ] The **processors**: Cloudflare + Clerk (link their DPAs).
- [ ] How to exercise **erasure/access** — the existing data-request form.

Before `POST /v1/erasure/request` goes live, the operator must also:

- [ ] Arm `TURNSTILE_SECRET`, the bot gate. It fails **open** when unset.
- [ ] Bind `AGENT_RATELIMIT`, the rate limit.

Without both, an attacker can email-bomb a known subject through the public form.

This template ships the schema + mechanism; the **prose is per-client** and is authored
in the Studio legal pages, not in code.

## Issue tags

- `@debt SECURITY` — retention is enforced by the cron purge; verify it runs once the
  operator binds `DB` + the schedule.
