---
title: "Resend sender"
description: "Sends one email through the Resend REST API with a single fetch, no SDK."
status: stable
---

# Resend sender

> A minimal, server-only sender — one fetch to the Resend REST API.

## Purpose

Sends one email through the Resend REST API. It uses no SDK — a single `fetch` to the emails endpoint — and reads `RESEND_API_KEY` from the environment (server-only, never a `NEXT_PUBLIC_` variable). It throws on a missing key or a non-2xx response, so callers treat sending as best-effort. When `EMAIL_ADMIN_BCC` is set, that address is merged into the `bcc` list (deduped) so every email copies the admin. This module is `server-only`.

## Exports

- `sendEmail(input)` — send one email; resolves on success, throws on a missing key or non-2xx response.
- `SendEmailInput` — the input type: `from`, `to`, optional `cc` / `bcc` / `replyTo`, `subject`, `text`, optional `html`.

## Usage

```ts
import { sendEmail } from "@indiecrafts/packages-web-email/resend";

await sendEmail({
  from: "hello@example.com",
  to: ["user@example.com"],
  subject: "Welcome",
  text: "Your account is ready.",
});
```

## Source

`code/packages/web/email/src/resend.ts`
