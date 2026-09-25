---
title: "Contact confirmation email"
description: "Renders the sender-facing 'we got your message' contact acknowledgement email."
status: stable
---

# Contact confirmation email

> A copy-agnostic acknowledgement to the person who submitted the contact form.

## Purpose

This template renders the "we got your message" acknowledgement sent to the person who submitted the contact form. It is copy-agnostic: the caller resolves the sender-locale strings (from Sanity `emailStrings`) and passes them in. There is no link — a contact acknowledgement just reassures. `intro` and `outro` may be multi-line (one paragraph per line).

## Exports

- `renderContactConfirmEmail` — takes `ContactConfirmInput`, returns a `RenderedEmail` (`{ subject, text, html }`).
- `ContactConfirmInput` — type `{ subject, heading, intro, outro?, supportEmail? }`.

## Usage

```ts
import { renderContactConfirmEmail } from "@indiecrafts/modules-web-contact/emails/contact-confirm";

const email = renderContactConfirmEmail({
  subject: "Nous avons bien reçu votre message",
  heading: "Merci de nous avoir écrit",
  intro: "Nous vous répondrons dès que possible.",
});
```

## Source

`code/modules/web/contact/src/emails/contact-confirm.ts`
