---
title: "General contacts (api)"
description: "POST /v1/contacts/general — a waitlist or contact-form person as a Resend contact."
status: stable
---

# General contacts (api)

> The api side of `POST /v1/contacts/general`: the General topic and the waitlist consent proof.

## Purpose

The website server calls `POST /v1/contacts/general` (admin bearer) after it saves a waitlist
entry or a contact message. The route validates the body (`email`, `locale`, `source`; a waitlist
join also needs `policyVersion` and `consentAt`), then:

1. **Waitlist only** — appends the consent proof to `consent_events` (`consent_type: "waitlist"`,
   keyed by the email fingerprint, never the email; a repeat with the same `consentAt` adds no row).
2. Upserts the Resend contact with `syncGeneralContact`. A waitlist join opts into the `general`
   topic, whose id comes from the Studio `emailPreferences` singleton (category `general`). A
   contact message stores the contact with no topic. An existing contact is left untouched — its
   language, its global unsubscribe and its topic choices: a single-opt-in form never overrides
   an opt-out made in the preference centre.

A Resend error answers `502`; a missing `RESEND_API_KEY`, `MAIN_DB` or `GDPR_FINGERPRINT_SALT`
answers `503`. Erasure deletes the Resend contact; the consent rows stay as pseudonymised proof
(keyed by the email fingerprint), like every visitor consent row.

## Exports

- `syncGeneralContact(env, { email, locale, source })` — the Resend upsert; throws on a Resend error.
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
