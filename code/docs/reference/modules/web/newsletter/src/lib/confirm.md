---
title: "Subscription confirm"
description: "Signs and verifies the newsletter double opt-in token, and confirms a subscription from it."
status: stable
---

# Subscription confirm

> Completes the double opt-in: verify the signed link, store the subscriber in Resend, deliver lead magnets.

## Purpose

Nothing is stored at sign-up, so the confirm link carries the whole sign-up: address, language, purpose (`newsletter: false` for a lead-magnet-only request), tags, source, policy version and issue time. `signConfirmToken` HMAC-signs it with `NEWSLETTER_SECRET` (`signHmac` from `@indiecrafts/packages-shared-gated-delivery`) with an expiry `CONFIRM_TOKEN_DAYS` (7) after issue; `verifyConfirmToken` returns the payload only for a valid, unexpired token with well-formed fields (a known locale, a valid email).

`confirmSubscription` runs on the visitor's tap (the POST `/api/newsletter/confirm` route). A newsletter sign-up goes to the api (`subscribeContact`, with the visitor's IP so the api rate-limits per visitor), which records the consent proof at the tap and upserts the Resend contact; if that fails the answer is `"error"` and nothing else happens, so the visitor can tap again. Then any lead magnet in `tags` is e-mailed and, for a newsletter sign-up, the owner alert (`newsletterOwner`, site default locale) is sent — both best-effort. The token is not single-use: a later tap is a new, explicit consent with its own proof row (and re-sends the lead magnet). Server-only.

## Exports

- `CONFIRM_TOKEN_DAYS` — how many days a confirmation link works.
- `ConfirmPayload` — the signed sign-up: `email`, `locale`, `newsletter`, `tags`, `source?`, `policyVersion`, `issuedAt`.
- `signConfirmToken(payload, secret)` — the signed token for the confirm link.
- `verifyConfirmToken(token, secret, now?)` — the payload, or `null` (never throws).
- `confirmSubscription(token, { clientIp?, now? })` — `"confirmed"` · `"invalid"` (bad, expired, or no secret) · `"error"` (the api could not store the subscriber).

## Usage

```ts
import { confirmSubscription } from "@indiecrafts/modules-web-newsletter/lib/confirm";

const status = await confirmSubscription(token); // "confirmed" | "invalid" | "error"
```

## Source

`code/modules/web/newsletter/src/lib/confirm.ts`
