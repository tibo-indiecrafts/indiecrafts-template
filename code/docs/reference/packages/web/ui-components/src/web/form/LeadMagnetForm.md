---
title: "Lead-magnet form"
description: "Client lead-magnet capture form that posts an email to /api/newsletter tagged for gated delivery."
status: stable
---

# Lead-magnet form

> Client half of `module.lead-magnet` — captures an email to trigger gated document delivery.

## Purpose

`LeadMagnetForm` is the client half of `module.lead-magnet`, rendered by the server `<LeadMagnet>` wrapper. Every label is a resolved, per-locale string from the block. It posts to `/api/newsletter` with `source: "lead-magnet"` and the magnet id as a tag, so gated delivery knows which document to send. A hidden honeypot, a render timestamp, and Turnstile block bots. A `201` response means success; new and already-subscribed are deliberately indistinguishable so membership cannot be enumerated.

An empty label falls back to the host app's `forms.*` messages, in the page language. The consent checkbox always shows, and submit stays disabled until it is ticked.

## Exports

- `LeadMagnetForm(props)` — the client lead-magnet capture form, typed as `LeadMagnetModule`.

## Usage

```tsx
import { LeadMagnetForm } from "@indiecrafts/packages-web-ui-components/web/form/LeadMagnetForm";

<LeadMagnetForm
  heading="Get the guide"
  buttonLabel="Send it to me"
  magnet={{ id: "spring-guide" }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/form/LeadMagnetForm.tsx`
