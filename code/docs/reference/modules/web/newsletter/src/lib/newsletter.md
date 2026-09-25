---
title: "Subscribe engine"
description: "Validates and stores a newsletter subscription, then fires best-effort confirmation and owner-alert emails."
status: stable
---

# Subscribe engine

> The single runtime write path for the newsletter block — validate, dedupe, store, notify.

## Purpose

`subscribe` is the newsletter module's write path for the `module.newsletter` block. It validates the input, always stores a `subscriber` doc (deduped by email, fields whitelisted, `_type` hard-coded), and stamps the accepted privacy-policy version as GDPR proof of consent. On a new or re-armed subscriber it fires two best-effort emails that never throw: a double opt-in confirmation to the subscriber and an owner alert. A honeypot field marks bots as spam and drops them while still returning success. Server-only.

## Exports

- `SubscribeInput` — the subscribe payload: `email`, `consent`, plus optional `source`, `language`, `tags`, `honeypot`, `startedAt`.
- `SubscribeResult` — `{ ok: true, already? }` or `{ ok: false, error }` where `error` is `"invalid" | "spam" | "server"`.
- `validateSubscribe(input)` — pure validator (anti-spam, email, consent checks).
- `subscribe(input, createdAt, policyVersion?)` — the async engine; validates, writes, and sends the emails.

## Usage

```ts
import { subscribe } from "@indiecrafts/modules-web-newsletter/lib/newsletter";

const result = await subscribe(
  { email: "jo@example.com", consent: true, source: "/blog" },
  new Date().toISOString(),
  "2026-01-01",
);
```

## Source

`code/modules/web/newsletter/src/lib/newsletter.ts`
