---
title: "Sign-up engine"
description: "Validates a newsletter or lead-magnet sign-up and emails its signed double opt-in link; nothing is stored."
status: stable
---

# Sign-up engine

> The runtime path of the newsletter and lead-magnet blocks — validate, sign, email the confirm link.

## Purpose

`subscribe` handles a sign-up from the `module.newsletter` or `module.lead-magnet` block. Resend is the only subscriber list, so nothing is stored here: it validates the input (anti-spam, email, consent), signs the sign-up with `signConfirmToken` and emails the confirm link — `/<locale>/newsletter/confirm#t=<token>`, the token in the URL fragment so it never reaches a server log — in the visitor's language (empty Studio copy falls back to `confirmEmailDefaults(locale)`). `LEAD_MAGNET_SOURCE` marks a lead-magnet-only request (`newsletter: false`). Every real sign-up gets the email, also an already-subscribed address, so the answer never reveals membership. When the secret, the Resend key, the confirmation email or (for a newsletter sign-up) the api is missing, it returns `unavailable` — never a silent drop. A honeypot field marks bots as spam. Server-only.

## Exports

- `LEAD_MAGNET_SOURCE` — the `source` the lead-magnet block posts.
- `SubscribeInput` — the payload: `email`, `consent`, plus optional `source`, `language`, `tags`, `honeypot`, `startedAt`.
- `SubscribeResult` — `{ ok: true }` or `{ ok: false, error }` where `error` is `"invalid" | "spam" | "unavailable" | "server"`.
- `validateSubscribe(input)` — pure validator (anti-spam, email, consent).
- `subscribe(input, policyVersion?, now?)` — validates, signs and sends the confirmation email.

## Usage

```ts
import { subscribe } from "@indiecrafts/modules-web-newsletter/lib/newsletter";

const result = await subscribe(
  { email: "jo@example.com", consent: true, source: "/blog", language: "fr" },
  "2026-01-01",
);
```

## Source

`code/modules/web/newsletter/src/lib/newsletter.ts`
