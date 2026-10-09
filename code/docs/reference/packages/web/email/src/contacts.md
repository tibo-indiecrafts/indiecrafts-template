---
title: "General contacts"
description: "Adds a waitlist or contact-form person to the Resend contacts through the shared api."
status: stable
---

# General contacts

> A waitlist join or a contact message also becomes a Resend contact, on the General topic.

## Purpose

`addGeneralContact` posts a saved submission to the shared api (`POST /v1/contacts/general`, the
server bearer `APP_API_TOKEN`, one safe retry). The api upserts the Resend contact:

- `source: "waitlist"` — opts into the `general` topic and records the consent proof in D1
  (`policyVersion`, `consentAt`). The waitlist consent covers early-access news.
- `source: "contact"` — stores the contact only, with no topic. That consent covers a reply, not
  broadcasts.

An existing Resend contact keeps its own fields: a newsletter subscriber's language and a global
unsubscribe never change. The Sanity document stays the record, so the call is best-effort: it
never throws, and an unconfigured api skips it. Server-only.

## Exports

- `addGeneralContact({ email, locale, source, policyVersion?, consentAt? })` — returns
  `"added"`, `"skipped"` (no `API_URL`/`APP_API_TOKEN`) or `"failed"`. The caller logs a failure
  without the address.
- `GeneralContact` — the input type.

## Source

`code/packages/web/email/src/contacts.ts`
