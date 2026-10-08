---
title: "Waitlist confirm email"
description: "Renders the 'you're on the list' confirmation email sent to a new waitlist joiner."
status: stable
---

# Waitlist confirm email

> A simple welcome email — no confirm link, just the joiner's copy.

## Purpose

Renders the waitlist confirmation email a new joiner receives. The file is copy-agnostic: the caller resolves the joiner-locale strings (from the Sanity `emailStrings` config, else `waitlistConfirmDefaults`) and passes them in. Unlike the newsletter, a waitlist has no confirm link — it just welcomes. `intro` and `outro` may be multi-line; each non-empty line becomes one escaped paragraph.

## Exports

- `WaitlistConfirmInput` — the render input: `subject`, `heading`, `intro`, plus optional `outro` and `supportEmail`.
- `waitlistConfirmDefaults(locale, name?)` — the fallback `subject`, `heading` and `intro` for an empty Studio field: English or French, English for any other locale.
- `renderWaitlistConfirmEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).

## Usage

```ts
import { renderWaitlistConfirmEmail } from "@indiecrafts/modules-web-waitlist/emails/waitlist-confirm";

const email = renderWaitlistConfirmEmail({
  subject: "You're on the list",
  heading: "Welcome",
  intro: "Thanks for joining the waitlist. We'll be in touch soon.",
});
```

## Source

`code/modules/web/waitlist/src/emails/waitlist-confirm.ts`
