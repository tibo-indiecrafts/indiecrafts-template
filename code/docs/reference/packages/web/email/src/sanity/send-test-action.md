---
title: "Send test email action"
description: "Studio document action that sends a sample of every enabled email to an address."
status: stable
---

# Send test email action

> A Studio document action that mails a sample of every enabled email of one group to a chosen address.

## Purpose

Adds the "Envoyer un test" action to the `emailStrings` and `clerkEmails` singletons. An editor picks a group — site emails, service emails (erasure, data request) or account emails (Clerk + welcome) — and a language (one or all), enters an address, and the action POSTs `/api/emails/test` with `{ to, scope, locales }`, forwarding the logged-in editor's Sanity session token so the route can verify it before sending. On the `clerkEmails` page the account group is preselected. The dialog lists any email that failed.

## Exports

- `sendTestEmailAction` — a Sanity `DocumentActionComponent` rendering the address dialog and send flow.

## Usage

```tsx
import { sendTestEmailAction } from "@indiecrafts/packages-web-email/sanity";

// sanity.config.ts
document: {
  actions: (prev, ctx) =>
    ctx.schemaType === "emailStrings" || ctx.schemaType === "clerkEmails"
      ? [...prev, sendTestEmailAction]
      : prev,
};
```

## Source

`code/packages/web/email/src/sanity/send-test-action.tsx`
