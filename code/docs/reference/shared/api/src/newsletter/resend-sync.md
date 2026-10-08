---
title: "Newsletter Resend sync"
description: "Mirrors newsletter subscribers to Resend's news topic and flows Resend unsubscribes back to the Sanity subscriber."
status: stable
---

# Newsletter Resend sync

> One newsletter list in Resend: the `news` topic mirrors the Sanity `subscriber` docs.

## Purpose

The Sanity `subscriber` doc is the source of truth for the newsletter. This module keeps Resend in step, in two directions:

- **Website → Resend** (`POST /v1/newsletter/subscribers`). A confirmed subscriber gets the global flag `unsubscribed: false` and the `news` topic `opt_in`. An unsubscribe sets the `news` topic to `opt_out` only — the global flag stays.
- **Resend → Sanity** (`POST /v1/resend/webhook`). An unsubscribe made in Resend (Broadcast link or preference page) sets the confirmed subscriber doc(s) to `unsubscribed`. It never sets `confirmed`: re-subscribing needs the double opt-in.

The `news` topic id comes from the Studio `emailPreferences` singleton (`fetchEmailPreferences`, category key `news`). With no topic id, only the global flag counts. D1 `email_preferences` (signed-in users) is not touched.

## Exports

- `isNewsletterEmail(value)` — `isValidEmail` plus no URL-path characters (the email goes raw into Resend's path).
- `syncNewsletterSubscriber(env, { email, locale, granted }, doFetch?)` — website → Resend. No-op without `RESEND_API_KEY`; throws on a Resend error (the route logs it and still answers `204`).
- `ResendContactEvent` — the webhook payload fields read.
- `handleResendContactEvent(env, evt, doFetch?)` — Resend → Sanity. Handles `contact.updated`, `contact.deleted` and `contact.topics.updated`; returns `"ignored"`, `"kept"` or `"unsubscribed"`. Throws when the Sanity write fails or is unconfigured, so the route answers `500` and Resend retries. Idempotent: only `confirmed` docs match.

## Usage

```ts
import { syncNewsletterSubscriber } from "./newsletter/resend-sync";

await syncNewsletterSubscriber(env, {
  email: "reader@example.com",
  locale: "en",
  granted: true,
});
```

## Source

`code/shared/api/src/newsletter/resend-sync.ts`
