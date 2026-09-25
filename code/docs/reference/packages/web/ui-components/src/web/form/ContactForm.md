---
title: "Contact form"
description: "Client contact form that posts a message to /api/contact with honeypot, timing, and Turnstile anti-bot guards."
status: stable
---

# Contact form

> Client half of `module.contact` — resolved copy in, a `contactMessage` doc out.

## Purpose

`ContactForm` is the client half of `module.contact`, rendered by the server `<Contact>` wrapper. Every label is a resolved, per-locale string from the block. It posts to `/api/contact`, which creates a `contactMessage` document. Name and subject fields appear only when their placeholder is set; the message textarea is always present. A hidden honeypot, a render timestamp, and Turnstile block bots. A `201` response means success; anything else is an error.

## Exports

- `ContactFormProps` — type: the resolved copy, `Omit<ContactModule, "_type" | "_key" | "hidden">`.
- `ContactForm(props)` — the client contact form component.

## Usage

```tsx
import { ContactForm } from "@indiecrafts/packages-web-ui-components/web/form/ContactForm";

<ContactForm
  heading="Get in touch"
  messagePlaceholder="Your message…"
  buttonLabel="Send"
  consentText="I agree to be contacted."
/>;
```

## Source

`code/packages/web/ui-components/src/web/form/ContactForm.tsx`
