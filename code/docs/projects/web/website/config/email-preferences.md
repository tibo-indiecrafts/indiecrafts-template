---
title: "Email preferences"
description: "Per-category marketing email opt-ins."
status: stable
---

# Email preferences

Per-category marketing email opt-ins. An editor defines the categories in Sanity; a
subscriber toggles each one in a preference centre, signed in or from an email link.
This replaces a single "marketing emails" flag with named categories the editor
controls, each mapped to a Resend Topic for real sending.

## The model

- **Categories — Sanity.** The `emailPreferences` singleton (`code/packages/web/email/src/sanity/email-preferences.ts`)
  holds `categories[]` (editor-defined) and `notices[]` (display-only, seeded with two account and security notices). Each category has
  a `key` (locked after first save — code matches on it), a localized `name`/`description`,
  `includeAtSignup` (pre-checked at sign-up), and `resendTopicId`. Seeded with four
  reserved keys: `news`, `offers`, `partners`, `tips`. A notice has no `key` or toggle — it
  lists a transactional email the subscriber always gets (e.g. order confirmations).
- **State + proof — D1.** `email_preferences` (`main` D1, migration `0009`) holds one row
  per user per category (`user_id`, `category_key`, `granted`, `updated_at`). Every write
  also appends a `consent_events` proof row, `consent_type = 'email_pref:<key>'` — the
  same append-only idiom as cookie consent.
- **Derived cache.** `user_profiles.marketing_email` is no longer the source of truth — it's
  recomputed after every write as "any category granted", kept only because other code
  still reads the single flag. The single "Commercial emails" yes/no (the sign-up box, the
  sign-in nudge, the account switch) writes through the categories too
  (`applyMarketingDecision`): yes grants the `includeAtSignup` categories, no turns every
  category off. So the switch and the Emails page never disagree.
- **The api is the single reader.** `fetchEmailPreferences` (`code/shared/api/src/consent/email-preferences-sanity.ts`)
  reads the Sanity singleton over GROQ, locale-resolved. Every surface calls the api;
  none reads Sanity directly. It **never throws** — an unset, unreachable, or empty
  Studio falls back to a seeded `news`-only default, so the preference centre is never blank.

## Routes

All on `code/shared/api` (`code/shared/api/src/consent/email-preferences.ts`):

| Route                                            | Auth                   | Purpose                                                                                                                |
| ------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `GET /v1/consent/email-preferences`              | Clerk JWT              | Read the caller's categories, notices, and `marketing_email`; `?locale=` picks the copy language (else the profile's). |
| `POST /v1/consent/email-preferences`             | Clerk JWT              | Write `{ updates: [{key, granted}], surface? }`.                                                                       |
| `GET /v1/email-preferences?token=…`              | signed token, no login | Same read, from an email link.                                                                                         |
| `POST /v1/email-preferences`                     | signed token, no login | Same write, `{ token, updates, surface? }`.                                                                            |
| `POST /v1/email-preferences/unsubscribe?token=…` | signed token, no login | RFC 8058 one-click unsubscribe.                                                                                        |

A write validates every `key` against the current Sanity categories, upserts the D1 row,
appends the proof row, recomputes `marketing_email`, and best-effort mirrors the changed
categories to Resend Topics — the D1 write is the source of truth; a Resend failure never
blocks it.

## No-login token + one-click unsubscribe

`emailPreferenceLinks(env, uid, cat?)` (same file) signs a token with `EMAIL_PREF_SECRET`
via `signHmac`/`verifyHmac` (`@indiecrafts/packages-shared-gated-delivery`) and returns:

- `manageUrl` — `${WEBSITE_URL}/email-preferences?token=…`, the public preference centre.
- `unsubscribeUrl` — the RFC 8058 one-click target, plus the `List-Unsubscribe` /
  `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers a sender attaches to outbound
  marketing mail.

The token carries no PII beyond the user id and never expires — links in already-sent mail
must keep working. Passing `cat` scopes the unsubscribe to one category; omitted, one-click
unsubscribe turns off every marketing category. `handleOneClickUnsubscribe` always returns
`200` on a valid token, even if the category named in a stale token no longer exists in
Sanity — RFC 8058 requires success semantics, not partial-failure reporting.

## Resend Topics setup (operator)

Resend Topics are the per-category primitive — Resend's `unsubscribed` flag is global, not
per-category, so per-category state needs Topics. Setup, per environment:

1. Create **one Resend Topic per Sanity category**, with `default_subscription: opt_out`
   (run `pnpm resend:topics:sync`, which is idempotent).
2. Paste each Topic's id into the matching category's `resendTopicId` field in Sanity.
3. Set `RESEND_API_KEY` (also used for `email_preferences`'s sibling, the `marketing_email`
   contact mirror) and verify the sending domain in Resend. Contacts are global — Resend
   renamed Audiences to Segments — so there is no audience id to configure.

`syncContactTopics` (`code/shared/api/src/resend-audience.ts`) upserts the contact's topic
subscriptions (`opt_in`/`opt_out` per `granted`). A category with no `resendTopicId` is
skipped — Sanity and Resend stay independently valid; a category can exist before its Topic
does. An unset `RESEND_API_KEY` makes every sync a no-op — the feature degrades to
capture-only (D1 keeps the real state; nothing reaches Resend).

## Consent behavior

- **Grant a category** → the matching Topic is set `opt_in`.
- **Remove a category** → the matching Topic is set `opt_out`; the Resend **contact is
  kept** (other categories may still be granted).
- **Erasure** → `email_preferences` rows are hard-deleted (`d1-core` adapter,
  `code/shared/api/src/erasure/d1.ts`). A DSAR erasure or an admin delete **deletes the
  Resend contact** (`deleteResendContact`); a self-service account delete suppresses it into
  the churned topic instead ([churn tracking](./churn.md)).

## Sign-up grant

On `user.created`, if the sign-up opted into marketing (`unsafe_metadata.marketing_email`),
the webhook grants every Sanity category with `includeAtSignup: true` (falling back to
`news` if none is flagged) — the new user starts subscribed to the categories the editor
chose as defaults, with the same D1 write, proof row and Resend mirror (topics + the
`newsletter-<locale>` segment) as any other change. An unticked box writes no category and
never calls Resend.

## Web + mobile

- **Website + app** — `EmailPreferences` (`@indiecrafts/packages-shared-compliance/web`)
  renders a switch per category plus the read-only notices list. It's transport-agnostic
  (`read`/`write` injected), mounted twice:
  - in the account widget's **Emails** page (Clerk `<UserProfile>`, `packages-web-auth`) —
    the header avatar modal and the full `/account` page, on the website **and** the app,
    through the JWT transport `emailPreferencesIo`. The read sends the page `locale`, so the
    category copy matches the UI language;
  - on the website's public, unauthenticated `/email-preferences?token=…` page
    (`EmailPreferencesPublic`) for a recipient who isn't signed in — kept out of nav,
    sitemap, and llms.txt, like `/newsletter/confirm`.
- **Mobile** — the Capacitor shell loads the `app` surface, so it has the same Emails page.

## Known gaps / follow-ups

- **Live Resend wiring is operator-run.** Creating the Topics, pasting `resendTopicId`s,
  and setting a real `RESEND_API_KEY` is manual (above). With no key the mirror no-ops —
  capture is D1-only.
- **No manual visual/a11y pass yet** on the public token page — not runnable in this CI. The
  account widget's Emails page was checked on 2026-10-02 (website + app, en/fr, 375/768/1280).
