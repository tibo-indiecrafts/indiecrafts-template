---
title: "Welcome email"
description: "Sends the best-effort post-signup welcome email in the recipient's locale."
status: stable
---

# Welcome email

> The user.created welcome — best-effort, never throws.

## Purpose

Sends the post-signup welcome email, fired from the `user.created` webhook rather than a Clerk `email.created` take-over (Clerk has no welcome template). It is best-effort: a missing recipient or unconfigured mailer is a silent no-op, and a Resend failure (a non-2xx or a timeout) is logged as `welcome email failed` (error name only, no address) instead of rejecting, so the webhook's `waitUntil` and profile sync are unaffected. The HTML is wrapped in the recipient's language (`inLanguage`), so a screen reader reads a French email in French. Copy is the Studio `clerkEmails.welcome` override in the recipient's locale, else the template's hardcoded en/fr, with the support footer and global bcc applied. The send carries the Resend `Idempotency-Key` `welcome/<userId>`, so a webhook retry sends it once.

## Exports

- `sendWelcomeEmail(env, { to, locale, userId }, send?, fetchStrings?)` — sends the welcome email; `send` and `fetchStrings` are injectable for tests.

## Usage

```ts
import { sendWelcomeEmail } from "./clerk-email/welcome";

await sendWelcomeEmail(env, { to: user.email, locale: "fr", userId: user.id });
```

## Source

`code/shared/api/src/clerk-email/welcome.ts`
