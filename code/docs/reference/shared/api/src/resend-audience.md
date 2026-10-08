---
title: "Resend contact mirror"
description: "Best-effort helpers that mirror marketing-email consent decisions to Resend's global Contacts."
status: stable
---

# Resend contact mirror

> Mirror consent decisions to Resend Contacts, keyed by email — best-effort, no audience id.

## Purpose

Mirrors each marketing-email consent decision to Resend's global Contacts. Resend is also the newsletter's only list: a newsletter contact carries a `locale` property and sits in one `newsletter-<code>` language segment. Resend renamed Audiences to Segments and made Contacts global, so a contact is addressed by email in the path, with no audience id. Every function no-ops when `RESEND_API_KEY` is unset, so the feature degrades to capture-only when Resend is unconfigured. Callers wrap these in try/catch and log — a Resend failure never blocks the D1 write that is the real source of truth.

## Exports

- `ResendAudienceEnv` — the `Env` slice this module needs (`RESEND_API_KEY?`), never the full worker `Env`.
- `upsertResendContact` — create-or-update the contact with the global `unsubscribed` marketing flag from `granted`.
- `syncContactTopics` — create-or-update the contact's per-topic subscriptions, mapping `granted` to `opt_in`/`opt_out`. With `newsletterLocale` (the `news` category changed): a locale sets the `locale` property and moves the contact to `newsletter-<locale>`; `null` removes it from every `newsletter-*` segment.
- `subscribeNewsletterContact` — a confirmed newsletter subscriber: global `unsubscribed: false`, the `locale` property and the `news` topic `opt_in` in one upsert, then the `newsletter-<locale>` segment (out of the other `newsletter-*` segments). No such segment (setup not run) → segments untouched.
- `getContactTopics` — the contact's topic subscriptions (`GET /contacts/{email}/topics`); null when unknown or on error. The DSAR export reads it.
- `suppressResendContact` — suppress a departed contact: global unsubscribe, opt out of every marketing topic, opt into the churned topic, and stamp the churn reason.
- `deleteResendContact` — remove the contact (the erasure pure-delete); a 404 counts as success.

## Usage

```ts
import { upsertResendContact } from "@indiecrafts/shared-api/resend-audience";

await upsertResendContact(env, { email: "reader@example.com", granted: true });
```

## Source

`code/shared/api/src/resend-audience.ts`
