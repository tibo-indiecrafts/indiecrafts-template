---
title: "Newsletter email groups"
description: "Defines the newsletter transactional-email groups on the shared emailStrings singleton."
status: stable
---

# Newsletter email groups

> The confirmation, owner-alert, and lead-magnet field groups contributed to `emailStrings`.

## Purpose

Defines the newsletter module's transactional-email groups on the shared `emailStrings` singleton: the double opt-in confirmation to the subscriber (translated), the new-subscriber alert to the team, and the lead-magnet delivery copy. Built with the `confirmationGroup` / `ownerAlertGroup` helpers from `@indiecrafts/packages-web-email/sanity`. Contributed via `newsletterSanity.emailGroups`; read at runtime as `getEmailStrings()?.newsletterConfirm` / `?.newsletterOwner` / `?.leadMagnet`.

## Exports

- `emailGroups` — array of Sanity field groups for `newsletterConfirm`, `newsletterOwner`, and `leadMagnet`.

## Source

`code/modules/web/newsletter/src/sanity/email.ts`
