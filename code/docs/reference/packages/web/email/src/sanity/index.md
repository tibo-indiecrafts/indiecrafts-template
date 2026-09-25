---
title: "Email Sanity module"
description: "The barrel that assembles the email brick's Sanity contribution — the composed emailStrings singleton and its desk."
status: stable
---

# Email Sanity module

> One SanityModule that composes the emailStrings singleton from every module's groups.

## Purpose

Assembles the email brick's Sanity contribution — the `emailStrings` singleton and its "E-mails" desk entry. The singleton's fields are composed from every module's `emailGroups`, so `emailSanity` takes the same module list passed to `composeSanity`. The brick owns the document (name, desk, and the "Send test" action); the modules own their groups, so removing a module makes its group disappear. This barrel also re-exports the group factories, the Clerk and security-alert groups, the preferences schema, and the test action.

## Exports

- `emailSanity(modules)` — build the email `SanityModule` from the module list.
- `confirmationGroup` / `ownerAlertGroup` — re-exported group factories.
- `buildClerkEmails` / `clerkEmailsStructureItem` — re-exported Clerk email singleton and desk.
- `securityAlertGroups` — re-exported internal security-alert groups.
- `sendTestEmailAction` — re-exported "Send test" document action.
- `emailPreferencesSchema` / `emailPreferencesStructureItem` — re-exported preferences singleton and desk.

## Usage

```ts
import { emailSanity } from "@indiecrafts/packages-web-email/sanity";

composeSanity([...modules, emailSanity(modules)]);
```

## Source

`code/packages/web/email/src/sanity/index.ts`
