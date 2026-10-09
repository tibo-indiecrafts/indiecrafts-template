---
title: "General contacts"
description: "Adds a waitlist or contact-form person to the Resend contacts through the shared api."
status: stable
---

# General contacts

> A waitlist join or a contact message also becomes a Resend contact; a waitlist join also joins the General topic.

## Purpose

`addGeneralContact` posts a saved submission to the shared api (`POST /v1/contacts/general`, the
server bearer `APP_API_TOKEN`, one safe retry). The api upserts the Resend contact:

- `source: "waitlist"` — opts into the `general` topic and records the consent proof in D1
  (`policyVersion`, `consentAt`). The waitlist consent covers early-access news.
- `source: "contact"` — stores the contact only, with no topic. That consent covers a reply, not
  broadcasts.

An existing Resend contact is left untouched: its language, its global unsubscribe and its topic
choices never change. The Sanity document stays the record, so the call is best-effort: it never
throws, an unconfigured api skips it, and it waits at most 4 s with no retry. It sends the
visitor's IP as `x-client-ip`, so the api rate-limits per visitor. Server-only.

## Exports

- `addGeneralContact({ email, locale, source, policyVersion?, consentAt?, clientIp? })` — returns
  `"added"`, `"skipped"` (no `API_URL`/`APP_API_TOKEN`) or `"failed"`. The caller logs a failure
  without the address.
- `GeneralContact` — the input type.

## Source

`code/packages/web/email/src/contacts.ts`
