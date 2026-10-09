---
title: "Newsletter confirm email"
description: "Renders the double opt-in confirmation email sent to a new newsletter subscriber."
status: stable
---

# Newsletter confirm email

> Builds the double opt-in email with the confirmation button.

## Purpose

Renders the double opt-in confirmation email — for a newsletter sign-up and for a lead-magnet (document) request. The file is copy-agnostic: the caller resolves the subscriber-locale strings (from Sanity `emailStrings.newsletterConfirm` or `.leadMagnetConfirm`, else `confirmEmailDefaults`) and passes them in. `intro` and `outro` may be multi-line; each non-empty line becomes one escaped paragraph.

## Exports

- `NewsletterConfirmInput` — the render input: `subject`, `heading`, `intro`, `buttonLabel`, `confirmUrl`, plus optional `outro` and `supportEmail`.
- `confirmEmailDefaults(locale, purpose?)` — the last-resort subject, heading, intro and button label for a locale (English for any locale without its own). `purpose` is `"newsletter"` (default) or `"lead-magnet"`: the document-request copy says it does not subscribe to the newsletter.
- `renderNewsletterConfirmEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).

## Usage

```ts
import { renderNewsletterConfirmEmail } from "@indiecrafts/modules-web-newsletter/emails/newsletter-confirm";

const email = renderNewsletterConfirmEmail({
  subject: "Confirmez votre inscription",
  heading: "Plus qu'une étape",
  intro: "Confirmez votre adresse e-mail pour recevoir l'infolettre.",
  buttonLabel: "Confirmer mon inscription",
  confirmUrl: "https://example.com/fr/newsletter/confirm#t=abc",
});
```

## Source

`code/modules/web/newsletter/src/emails/newsletter-confirm.ts`
