---
title: "Email group factories"
description: "The two factories a module uses to contribute a transactional-email group to the emailStrings singleton."
status: stable
---

# Email group factories

> The subscriber-confirmation and internal-alert group factories.

## Purpose

Provides the generic factories for the `emailStrings` groups. Each transactional email is an object field on the one E-mails singleton; a module contributes its group with these helpers and wires them via `SanityModule.emailGroups`, so the brick never names a module. Two shapes cover every email today: a subscriber-facing confirmation with translated copy, and an internal alert to the site team with a plain subject.

## Exports

- `confirmationGroup(opts)` — a subscriber-facing email group with translated subject, heading, intro, optional button, and outro, plus optional sender and BCC fields.
- `ownerAlertGroup(opts)` — an internal alert group with recipient fields (to, cc, bcc), a sender, a plain subject, and optional reply-to and moderation buttons.

## Usage

```ts
import { confirmationGroup } from "@indiecrafts/packages-web-email/sanity";

export const emailGroups = [
  confirmationGroup({
    name: "newsletterConfirm",
    title: "Newsletter — confirmation",
    description: "…",
    enabledHint: "…",
    subjectHint: "…",
    introHint: "…",
    outroHint: "…",
    button: true,
  }),
];
```

## Source

`code/packages/web/email/src/sanity/groups.ts`
