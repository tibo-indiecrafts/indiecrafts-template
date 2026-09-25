---
title: "Newsletter form"
description: "Client newsletter capture form that posts an email to /api/newsletter to create a subscriber doc."
status: stable
---

# Newsletter form

> Client half of `module.newsletter` — resolved copy in, a `subscriber` doc out.

## Purpose

`NewsletterForm` is the client half of `module.newsletter`, rendered by the server `<Newsletter>` wrapper. Every label is a resolved, per-locale string from the block. It posts to `/api/newsletter`, which creates a `subscriber` document (the engine always stores in Sanity — no provider adapters). A hidden honeypot, a render timestamp, and Turnstile block bots. A `201` response means success; new and already-subscribed are deliberately indistinguishable so membership cannot be enumerated.

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
