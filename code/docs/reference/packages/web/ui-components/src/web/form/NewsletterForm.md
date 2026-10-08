---
title: "Newsletter form"
description: "Client newsletter capture form that posts an email to /api/newsletter to create a subscriber doc."
status: stable
---

# Newsletter form

> Client half of `module.newsletter` — resolved copy in, a double opt-in email out.

## Purpose

`NewsletterForm` is the client half of `module.newsletter`, rendered by the server `<Newsletter>` wrapper. Every label is a resolved, per-locale string from the block. It posts to `/api/newsletter`, which emails a double opt-in link; the confirm click makes the person a Resend subscriber (Resend is the only list). A hidden honeypot, a render timestamp, and Turnstile block bots. A `201` response means success; every real sign-up answers the same, so membership cannot be enumerated.

An empty label falls back to the host app's `forms.*` messages, in the page language. The consent checkbox always shows, and submit stays disabled until it is ticked.

## Exports

- `NewsletterForm(props)` — the client newsletter capture form, typed as `NewsletterModule`.

## Usage

```tsx
import { NewsletterForm } from "@indiecrafts/packages-web-ui-components/web/form/NewsletterForm";

<NewsletterForm
  heading="Stay in the loop"
  buttonLabel="Subscribe"
  variant="inline"
/>;
```

## Source

`code/packages/web/ui-components/src/web/form/NewsletterForm.tsx`
