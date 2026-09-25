---
title: "Send test email action"
description: "Studio document action that sends a sample of every enabled email to an address."
status: stable
---

# Send test email action

> A Studio document action that mails a sample of every enabled email to a chosen address.

## Purpose

Adds the "Envoyer un test" action to the `emailStrings` singleton. An editor enters an address and the action POSTs `/api/emails/test`, forwarding the logged-in editor's Sanity session token so the route can verify it before sending. It covers only the site emails (newsletter, waitlist, contact, comments); worker-sent auth and erasure emails are excluded.

## Exports

- `sendTestEmailAction` — a Sanity `DocumentActionComponent` rendering the address dialog and send flow.

## Usage

```tsx
import { sendTestEmailAction } from "@indiecrafts/packages-web-email/sanity";

// sanity.config.ts
document: {
  actions: (prev, ctx) =>
    ctx.schemaType === "emailStrings" ? [...prev, sendTestEmailAction] : prev,
};
```

## Source

`code/packages/web/email/src/sanity/send-test-action.tsx`
