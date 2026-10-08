---
title: "Contact submit engine"
description: "Server-only submit path that validates a contact submission, stores it, and fires best-effort emails."
status: stable
---

# Contact submit engine

> The single runtime write path for the contact form and the `module.contact` block.

## Purpose

`submit` is the server-only write path for the contact form. It validates the input, then always stores a `contactMessage` document (no dedupe — a person may write more than once); the owner reads the inbox in Studio. Fields are whitelisted and `_type` is hard-coded. The document takes a dotted id from `privateId("contactMessage")`, so a public dataset hides it from anonymous reads. On a stored message, two best-effort emails may fire (configured on the shared `emailStrings` entity): a confirmation to the sender and an owner alert carrying the message with `reply-to` set to the sender. Neither email can fail the submission. A hidden honeypot field marks bot submissions as spam while the caller still returns success.

## Exports

- `submit` — async; takes `(input, createdAt, policyVersion?)`, validates, writes, sends emails, and returns a `SubmitResult`.
- `validateSubmit` — pure validator; takes `Partial<SubmitInput>` and returns a `SubmitResult`.
- `SubmitInput` — type describing a submission (`email`, `message`, `consent`, plus optional `name`, `subject`, `source`, `language`, `honeypot`, `startedAt`).
- `SubmitResult` — type `{ ok: true } | { ok: false; error: "invalid" | "spam" | "server" }`.

## Usage

```ts
import { submit } from "@indiecrafts/modules-web-contact/lib/contact";

const result = await submit(
  { email, message, consent: true, source: "/contact" },
  new Date().toISOString(),
  policyVersion,
);
```

## Source

`code/modules/web/contact/src/lib/contact.ts`
