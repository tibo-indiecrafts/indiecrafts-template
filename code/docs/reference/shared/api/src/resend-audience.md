---
title: "Resend contact mirror"
description: "Best-effort helpers that mirror marketing-email consent decisions to Resend's global Contacts."
status: stable
---

# Resend contact mirror

> Mirror consent decisions to Resend Contacts, keyed by email — best-effort, no audience id.

## Purpose

Mirrors each marketing-email consent decision to Resend's global Contacts. Resend is also the newsletter's only list: a newsletter contact carries a `locale` property and sits in one `newsletter-<code>` language segment. Resend renamed Audiences to Segments and made Contacts global, so a contact is addressed by email in the path, with no audience id. Resend's team rate limit is low, so the newsletter and preference calls retry a `429` twice (after `Retry-After`, capped at 2 s), and the account's segment list is cached per isolate for 10 minutes (a miss refetches once). Every function no-ops when `RESEND_API_KEY` is unset, so the feature degrades to capture-only when Resend is unconfigured. Callers wrap these in try/catch and log — a Resend failure never blocks the D1 write that is the real source of truth.

## Exports

- `ResendAudienceEnv` — the `Env` slice this module needs (`RESEND_API_KEY?`), never the full worker `Env`.
- `syncContactTopics` — create-or-update the contact's per-topic subscriptions, mapping `granted` to `opt_in`/`opt_out`. With `newsletterLocale` (the `news` category changed): a locale sets the `locale` property and moves the contact to `newsletter-<locale>`; `null` removes it from every `newsletter-*` segment.
- `subscribeNewsletterContact` — a confirmed newsletter subscriber: global `unsubscribed: false`, the `locale` property, the `news` topic `opt_in` and the `newsletter-<locale>` segment. A new contact gets all of it in one `POST /contacts`; an existing one is updated, then moved out of the other `newsletter-*` segments. No `newsletter-<locale>` segment (setup not run) → throws: a subscriber outside every language segment would never get an issue.
- `upsertGeneralContact` — a waitlist or contact-form person (`POST /v1/contacts/general`): a new contact gets the `locale` property; an existing one keeps its fields (language, global unsubscribe). With a `topicId` the contact opts into that topic, new or existing; the route passes none for a contact message or a preference-centre opt-out.
- `clearSegmentCache` — forget the cached segment list (a test seam).
- `getContactTopics` — the contact's topic subscriptions (`GET /contacts/{email}/topics`); null when unknown or on error. The DSAR export reads it.
- `suppressResendContact` — suppress a departed contact: global unsubscribe, opt out of every marketing topic, opt into the churned topic, and stamp the churn reason.
- `deleteResendContact` — remove the contact (the erasure pure-delete); a 404 counts as success.
- `getResendContact` — the contact's global state (`{ exists, unsubscribed }`; `exists: false` for an unknown address, `null` on error). The admin email panel reads it.
- `turnOffContact` — an admin override: opt out of the given topics, and with `stopAll` the global unsubscribe. Never opts anything in.
- `moveResendContact` — after a sign-in email change: the new address gets the old contact's topics, segments, global unsubscribe and `locale`; the old contact is removed.

## Usage

```ts
import { syncContactTopics } from "@indiecrafts/shared-api/resend-audience";

await syncContactTopics(env, {
  email: "reader@example.com",
  topics: [{ topicId: "t_news", granted: true }],
  newsletterLocale: "en",
});
```

## Source

`code/shared/api/src/resend-audience.ts`
