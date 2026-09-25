---
title: "Newsletter settings schema"
description: "Sanity singleton for the newsletter enabled toggle and per-locale form copy."
status: stable
---

# Newsletter settings schema

> The editor layer on top of the `features.newsletter` code flag.

## Purpose

Defines the `newsletterSettings` Sanity singleton. The code flag `features.newsletter` is the hard on/off; this document is the editor-configurable layer — an `enabled` toggle plus per-locale form copy (`heading`, `description`, `buttonLabel`, `consentLabel`, `successMessage`). The subscribe emails live separately on the shared `emailStrings` singleton. Read at runtime via `getNewsletterSettings()`.

## Exports

- default — the `newsletterSettings` Sanity singleton type (`defineType`).

## Source

`code/modules/web/newsletter/src/sanity/schema/newsletter-settings.ts`
