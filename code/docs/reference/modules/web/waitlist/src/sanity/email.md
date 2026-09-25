---
title: "Waitlist email groups"
description: "The waitlist's two transactional-email groups on the shared emailStrings singleton."
status: stable
---

# Waitlist email groups

> The joiner confirmation and the team new-entry alert, as editable Studio groups.

## Purpose

Declares the waitlist's transactional-email groups contributed to the shared `emailStrings` singleton: a translated "you're on the list" confirmation to the joiner and a new-entry alert to the team. The join engine reads them as `getEmailStrings()?.waitlistConfirm` and `?.waitlistOwner`.

## Exports

- `emailGroups` — an array of two group definitions (`waitlistConfirm` confirmation group, `waitlistOwner` owner-alert group), built with the shared `confirmationGroup` and `ownerAlertGroup` factories.

## Usage

```ts
import { emailGroups } from "@indiecrafts/modules-web-waitlist/sanity/email";

// contributed via the module barrel's `emailGroups` field
```

## Source

`code/modules/web/waitlist/src/sanity/email.ts`
