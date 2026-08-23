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

## Cookie audit (operator)

Before go-live, enumerate every real cookie/tracker the site sets into Sanity
`cookieEntry` rows (name, provider, category, purpose, duration, party), so the
`CookieDeclaration` table is accurate. Gate every third-party embed (YouTube, maps,
fonts) behind `<ConsentGate category="marketing">`. This is a content + review task,
not code.

## Erasure (Art. 17)

On a data-subject **erasure** request (the `dataRequest` flow → Studio), purge the
subject's rows:

```sql
DELETE FROM session_events  WHERE user_id = ?;
DELETE FROM security_events  WHERE user_id = ?;
DELETE FROM admin_audit      WHERE actor_user_id = ? OR target_user_id = ?;
```

Run via `wrangler d1 execute indiecrafts-<env>-shared-api --command "…"`. Security
audit records _may_ be retained under legitimate interest where law allows — document
the operator's decision per request.

## Privacy-policy disclosure — operator checklist

The privacy policy (Sanity → Studio, per client) **must** now disclose:

- [ ] That sign-ins and admin actions are **logged** for security.
- [ ] The **data**: timestamp, surface, userId, country, a hashed IP (no raw IP).
- [ ] The **retention**: 90 days.
- [ ] The **lawful basis**: legitimate interest (account security + audit).
- [ ] The **location**: Cloudflare D1 in the EU.
- [ ] The **processors**: Cloudflare + Clerk (link their DPAs).
- [ ] How to exercise **erasure/access** — the existing data-request form.

This template ships the schema + mechanism; the **prose is per-client** and is authored
in the Studio legal pages, not in code.

## Issue tags

- `@debt SECURITY` — retention is enforced by the cron purge; verify it runs once the
  operator binds `DB` + the schedule.
