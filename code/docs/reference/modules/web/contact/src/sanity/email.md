---
title: "Contact email groups"
description: "Defines the contact module's confirmation and owner-alert email groups on the shared emailStrings singleton."
status: stable
---

# Contact email groups

> The contact form's two transactional-email groups, contributed to the shared `emailStrings` singleton.

## Purpose

This module defines the contact form's transactional-email groups on the shared `emailStrings` singleton: the translated "we got your message" confirmation to the sender, and the new-message alert to the team (which carries the message body). They are contributed via `contactSanity.emailGroups` and read as `getEmailStrings()?.contactConfirm` and `?.contactOwner`.

## Exports

- `emailGroups` — an array of two field groups built with `confirmationGroup` and `ownerAlertGroup` (`contactConfirm` and `contactOwner`).

## Usage

```ts
import { emailGroups } from "@indiecrafts/modules-web-contact/sanity/email";

// Contributed through the contactSanity SanityModule factory:
// { name: "contact", schemaTypes, structure, emailGroups }
```

## Source

`code/modules/web/contact/src/sanity/email.ts`
