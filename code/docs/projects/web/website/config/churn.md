---
title: "Churn tracking"
description: "An exit survey captures why a user deletes their account."
status: stable
---

# Churn tracking

An exit survey captures why a user deletes their account. Basis: legitimate interest — the
business needs to understand why customers leave. A GDPR erasure request
(`/v1/erasure/request` → confirm) is a carve-out. It still hard-deletes and keeps no churn
row.

## The model

- **Single writer.** `POST /v1/erasure/self` is the only route that writes `churn_events`.
  It's the authenticated self-service delete, the one that carries the survey. The Clerk
  webhook and the GDPR erasure-request flow never write it.
- **No email, no name.** `churn_events` stores an opaque `user_id`. The optional
  `feedback`/`competitor` free text is the only PII. That matches the `data_requests`
  table's existing minimization.
- **The webhook branches on the row.** `handleClerkUserDeleted` checks `churn_events` for
  the deleted user. A row present means self-service churn, so it suppresses the Resend
  contact instead of deleting it. No row means an explicit GDPR erasure or an admin
  delete, so it pure-deletes the contact, same as before.
- **The GDPR carve-out stays pure.** `POST /v1/erasure/request` → confirm never touches
  `churn_events` and never suppresses. It deletes everything, including the Resend
  contact.

## The `churn_events` table

`main` D1, migration `0010`. One row per departed user (`INSERT OR REPLACE` — a resubmit
overwrites, never duplicates):

| Column       | Type | Notes                                                                                    |
| ------------ | ---- | ---------------------------------------------------------------------------------------- |
| `user_id`    | TEXT | Primary key, opaque Clerk id.                                                            |
| `deleted_at` | TEXT | ISO 8601 timestamp.                                                                      |
| `reason`     | TEXT | A preset code, or NULL. Never trusts the client — unrecognized input normalizes to NULL. |
| `feedback`   | TEXT | Optional free text, capped at 4000 chars.                                                |
| `competitor` | TEXT | Optional free text, capped at 200 chars.                                                 |

Preset reason codes (`CHURN_REASONS` in `code/shared/api/src/consent/churn-store.ts`):
`too_expensive`, `not_using`, `missing_feature`, `found_alternative`, `too_hard`,
`privacy`, `other`.

## Resend suppression + the churned topic

A departing self-service user is suppressed, not deleted, so the business keeps a
win-back cohort:

- `suppressResendContact` sets the contact `unsubscribed: true` (off every marketing
  send), opts it out of every marketing topic, and opts it into the **churned** Topic, the
  cohort tag.
- `deleteResendContact` runs instead for the RTBF/admin carve-out (no churn row). The
  contact is removed outright, no win-back list.

**Localisation.** Resend Topics carry one name, no per-locale field. Localisation lives in
the Sanity `emailPreferences` singleton instead — the source of truth for topic ids and
display names. Resend Topics use `visibility: private`; a subscriber never sees the Resend
name, only the localised name Sanity serves through the preference centre.

`fetchEmailPreferences` (`code/shared/api/src/consent/email-preferences-sanity.ts`) reads
the singleton's new `churned` field and returns `churnedTopicId` + `optOutTopicIds`
alongside the existing categories. Both `handleErasureSelf` and `handleClerkUserDeleted`
resolve the churned topic id from this one read — neither hard-codes it.

## The exit survey — website and app

`DeleteAccountSection` (`@indiecrafts/packages-shared-compliance/web`) renders an optional
reason/feedback/competitor survey above the delete confirmation. Every field is optional;
submitting blank still deletes the account. The website and the app web surface both
render this shared component — no per-surface survey code.

**Mobile.** The Capacitor shell loads the `app` surface, so it renders the same survey.

The survey fields travel with the erasure POST — `rawErasureFetch`/`submitAccountErasure`
and the Clerk step-up path (`useClerkAuthPort`) both carry `reason`/`feedback`/
`competitor` through to `POST /v1/erasure/self`.

## Admin — the churn dashboard

`GET /v1/churn` (bearer-gated, `APP_API_TOKEN`) returns the aggregate:
`{ total, byDay, byReason, recentFeedback }`. The admin churn page
(`/churn`, `code/projects/web/surfaces/admin`) renders it — a total count, a by-reason
table, a by-day table, and the 50 most recent feedback rows. The endpoint reads
`churn_events` only; it never reads Resend.

## Retention

The cron worker purges `churn_events` rows older than `retention.churn_days` on every
scheduled tick — default 730 days (24 months), operator-overridable in `site_settings`,
the same override mechanism as the other retention windows.

## Operator setup

1. Run `pnpm resend:topics:sync`. It creates or verifies every Resend Topic — the four
   marketing categories plus `churned` — all `visibility: private`, and prints each
   Topic's id. Idempotent: rerunning finds existing topics by name instead of duplicating
   them.
2. Paste each printed id into the Sanity `emailPreferences` singleton: the marketing
   categories' `resendTopicId` fields, and the new `churned.resendTopicId` field.
3. Run migration `0010` against the `main` D1 (creates `churn_events` +
   `idx_churn_deleted_at`).

Until the churned topic id is set in Sanity, suppression still runs — the contact is
still globally unsubscribed and opted out of every marketing topic — it just skips the
churned-topic opt-in.

## Known limitation — a stale token after self-delete

`POST /v1/erasure/self` authenticates with `defaultAuthenticate`, which calls Clerk's
`verifyToken`. This check is networkless — it verifies the JWT's signature and expiry, not
whether Clerk has since revoked the session. A JWT issued just before deletion stays
valid for up to its own TTL (about 60 seconds) after the account and its data are gone.

This is an accepted limitation, not a bug. The blast radius is a stale token, not data:
any route the token still authenticates fails closed, because the user's data is already
erased. The self-erasure route itself fails closed too — `exportUser` 404s for a deleted
user, so a second call to `/v1/erasure/self` cannot succeed.

## Issue tags

- `@debt SECURITY` — `defaultAuthenticate`'s networkless `verifyToken` honours a cached JWT
  for up to its TTL (~60s) after Clerk deletion. Accepted: the blast radius is a stale
  token, not data.
