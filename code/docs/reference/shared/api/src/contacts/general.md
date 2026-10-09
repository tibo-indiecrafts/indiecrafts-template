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
   contact message stores the contact with no topic. An existing contact keeps its fields.

A Resend error answers `502`; a missing `RESEND_API_KEY`, `MAIN_DB` or `GDPR_FINGERPRINT_SALT`
answers `503`. Erasure already deletes the Resend contact and the consent rows by email.

## Exports

- `syncGeneralContact(env, { email, locale, source })` — the Resend upsert; throws on a Resend error.
- `isGeneralSource(value)` — `"waitlist"` or `"contact"`.
- `GeneralSource` — that union.

## Setup

Run `pnpm resend:topics:sync` once: it creates the private `General` topic. Paste its id into
Studio → E-mails → Préférences → category `general` → "Identifiant de topic Resend". Without an id,
a waitlist join is stored as a contact with no topic.

## Source

`code/shared/api/src/contacts/general.ts`
