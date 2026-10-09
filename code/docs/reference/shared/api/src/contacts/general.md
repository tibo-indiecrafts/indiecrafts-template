---
title: "General contacts (api)"
description: "POST /v1/contacts/general — a waitlist or contact-form person as a Resend contact."
status: stable
---

# General contacts (api)

> The api side of `POST /v1/contacts/general`: the General topic and the waitlist consent proof.

## Purpose

The website server calls `POST /v1/contacts/general` (admin bearer) after it saves a waitlist
entry or a contact message, and again when someone re-joins the waitlist. The route validates the
body (`email`, `locale`, `source`; a waitlist join also needs `policyVersion` and `consentAt`):

- **A waitlist join** needs `MAIN_DB` and `GDPR_FINGERPRINT_SALT`. It reads the `general` topic id
  from the Studio `emailPreferences` singleton (`generalTopicId`). With no id — no category, no id,
  or Sanity unreachable — it answers `503 { error: "no_topic" }` and writes nothing, so a later
  re-join can complete it. Otherwise it appends the consent proof to `consent_events`
  (`consent_type: "waitlist"`, keyed by the email fingerprint) and upserts the Resend contact
  opted into General — new or existing — unless the person turned General off in the preference
  centre (`generalChoice`, their account's `email_preferences` row). Resend topics are private, so
  that is the only place they can turn it off.
- **A contact message** needs no D1: it stores the Resend contact with no topic and no consent row.

An existing contact keeps its fields (its language, its global unsubscribe). A Resend error
answers `502`; no `RESEND_API_KEY` answers `503`. Erasure deletes the Resend contact; the consent
rows stay as pseudonymised proof (keyed by the email fingerprint), like every visitor consent row.

## Exports

- `generalTopicId(env, locale, doFetch?)` — the `general` topic id, or undefined.
- `generalChoice(db, fingerprint)` — the person's own General choice, or undefined.
- `isGeneralSource(value)` — `"waitlist"` or `"contact"`.
- `GeneralSource` — that union.

## Setup

1. Run `pnpm resend:topics:sync` once: it creates the private `General` topic and prints its id.
2. Studio → Préférences e-mail → Catégories. A new document has the `general` category already. An
   existing one does not: add a category with "Identifiant" `general`, the names (General /
   Général), and "Cochée par défaut à l'inscription" off.
3. Paste the topic id into that category's "Identifiant de topic Resend".

Without the category or its id, a waitlist join is stored as a contact with no topic and no error.

## Source

`code/shared/api/src/contacts/general.ts`
