---
title: "Newsletter subscribe"
description: "Records a newsletter double opt-in in D1 and makes the person a Resend subscriber."
status: stable
---

# Newsletter subscribe

> Resend is the newsletter's only list; the consent proof stays in D1.

## Purpose

The website stores nothing at sign-up. It emails a signed confirm link; on the click its server calls `POST /v1/newsletter/subscribers`. The route uses this module in two steps:

1. `recordNewsletterConsent` appends the proof to `consent_events`: `subject_type = 'visitor'`, `subject_id` and `email_fingerprint` = the salted email fingerprint, `consent_type = 'newsletter'`, `surface = 'website'`, `source = 'double_opt_in'`, `ts` = the confirm-token issue time. The email itself is never stored. `INSERT OR IGNORE` on `newsletter:<fp>:<consentAt>`, so a repeat click on the same link adds no row.
2. `syncNewsletterSubscriber` upserts the Resend contact: `unsubscribed: false`, `properties.locale`, the `news` topic `opt_in` and the `newsletter-<locale>` segment (via `subscribeNewsletterContact`). The `news` topic id comes from the Studio `emailPreferences` singleton; none set → no topic. A missing `newsletter-<locale>` segment throws (the route answers `502`).

Unsubscribe is Resend's own link; nothing here handles it.

## Exports

- `isNewsletterEmail(value)` — `isValidEmail` plus no URL-path characters (the email goes raw into Resend's path).
- `isConsentTime(value)` — an ISO 8601 date-time string.
- `recordNewsletterConsent(db, salt, { email, policyVersion, consentAt })` — the D1 proof row (no country or IP hash: the caller is the website server). An empty `policyVersion` is stored as `unknown`.
- `syncNewsletterSubscriber(env, { email, locale }, doFetch?)` — the Resend upsert. Throws on a Resend error (the route answers `502`).

## Usage

```ts
import {
  recordNewsletterConsent,
  syncNewsletterSubscriber,
} from "./newsletter/resend-sync";

await recordNewsletterConsent(env.MAIN_DB, env.GDPR_FINGERPRINT_SALT, {
  email: "reader@example.com",
  policyVersion: "2026-10",
  consentAt: "2026-10-08T09:30:00.000Z",
});
await syncNewsletterSubscriber(env, {
  email: "reader@example.com",
  locale: "fr",
});
```

## Source

`code/shared/api/src/newsletter/resend-sync.ts`
