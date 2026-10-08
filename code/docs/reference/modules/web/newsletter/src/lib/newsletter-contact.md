---
title: "Newsletter Resend contact"
description: "Makes a confirmed newsletter subscriber a Resend contact through the shared api."
status: stable
---

# Newsletter Resend contact

> Resend is the only list: a confirmed subscriber becomes a Resend contact through the api.

## Purpose

`subscribeContact` posts a confirmed sign-up to the shared api (`POST /v1/newsletter/subscribers`, the server bearer `APP_API_TOKEN`, the visitor's IP as `x-client-ip` so the api rate-limits per visitor, a 10 s timeout). The api records the consent proof in D1 and upserts the Resend contact: the `news` topic, the `locale` property and the `newsletter-<locale>` segment. It throws when the api is unconfigured or answers non-2xx, so a confirmation never reports success for a subscriber that was not stored. `newsletterApiConfigured` tells `subscribe` whether a newsletter sign-up can be accepted at all. Server-only.

## Exports

- `newsletterApiConfigured()` — `API_URL` and `APP_API_TOKEN` are set.
- `subscribeContact({ email, locale, policyVersion, consentAt, clientIp? })` — stores the subscriber; `consentAt` is the tap; throws on failure.

## Source

`code/modules/web/newsletter/src/lib/newsletter-contact.ts`
