---
title: "Clerk email handler"
description: "Renders and sends a localized auth email from a Clerk email.created event via Resend."
status: stable
---

# Clerk email handler

> The take-over path that localizes Clerk auth emails when "Delivered by Clerk" is off.

## Purpose

Handles a Clerk `email.created` event. It resolves the recipient's stored locale, renders a localized auth email from the event's `data` variables, and sends it via Resend. A known template slug is localized; an unknown slug forwards Clerk's own rendered English body so nothing is dropped. It throws when the mailer is unset or the send fails, so the caller returns 502 and Clerk retries — a verification code must not be silently lost.

## Exports

- `ClerkEmailEnv` — the env slice this handler needs: the mailer env plus a read handle to `MAIN_DB`, the fingerprint salt, and `WEBSITE_URL` (the new-device email's device-list link, passed to the template as `account_security_url`).
- `handleClerkEmail(env, data, send?, fetchStrings?)` — renders and sends the localized email; `send` and `fetchStrings` are injectable for tests.
- `sendAuthTemplate(env, { to, slug, locale, vars? }, strings, send?)` — renders one known template in `locale` (Studio copy, footer, `<div lang>`) and sends it; `false` for an unknown slug. Shared by the webhook and the Studio test (`POST /v1/emails/test`).

## Usage

```ts
import { handleClerkEmail } from "./clerk-email/handle";

await handleClerkEmail(env, event.data);
```

## Source

`code/shared/api/src/clerk-email/handle.ts`
