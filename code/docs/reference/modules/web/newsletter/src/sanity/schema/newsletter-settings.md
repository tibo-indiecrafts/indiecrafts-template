---
title: "Newsletter settings schema"
description: "Sanity singleton for the newsletter enabled toggle and per-locale form copy."
status: stable
---

# Newsletter settings schema

> The newsletter's live Studio switch, on top of the `features.newsletter` code flag.

## Purpose

Defines the `newsletterSettings` Sanity singleton. The code flag `features.newsletter` is the hard on/off; this document holds one field, `enabled`, the live editor switch. Off hides every newsletter and lead-magnet block and refuses sign-ups and confirmations (the routes and the confirm page answer 404). The form copy lives on each block; the subscribe emails on the shared `emailStrings` singleton. Read at runtime via `getNewsletterSettings()`.

## Exports

- default — the `newsletterSettings` Sanity singleton type (`defineType`).

## Source

`code/modules/web/newsletter/src/sanity/schema/newsletter-settings.ts`
