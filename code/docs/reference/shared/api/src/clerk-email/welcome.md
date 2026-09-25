---
title: "Welcome email"
description: "Sends the best-effort post-signup welcome email in the recipient's locale."
status: stable
---

# Welcome email

> The user.created welcome — best-effort, never throws.

## Purpose

Sends the post-signup welcome email, fired from the `user.created` webhook rather than a Clerk `email.created` take-over (Clerk has no welcome template). It is best-effort: a missing recipient or unconfigured mailer is a silent no-op and it never throws, so the webhook's profile sync is unaffected. Copy is the Studio `clerkEmails.welcome` override in the recipient's locale, else the template's hardcoded en/fr, with the support footer and global bcc applied.

## Exports

- `sendWelcomeEmail(env, { to, locale }, send?, fetchStrings?)` — sends the welcome email; `send` and `fetchStrings` are injectable for tests.

## Usage

```ts
import { sendWelcomeEmail } from "./clerk-email/welcome";

await sendWelcomeEmail(env, { to: user.email, locale: "fr" });
```

## Source

`code/shared/api/src/clerk-email/welcome.ts`
