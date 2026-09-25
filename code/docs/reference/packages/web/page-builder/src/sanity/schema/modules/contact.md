---
title: "Contact module"
description: "Sanity schema for the contact-form page-builder module."
status: stable
---

# Contact module

> A localized contact form block that submits to the contact API.

## Purpose

Defines the `module.contact` block: a contact form whose every label, placeholder, consent text, and status message is per-instance and per-locale. It submits to `/api/contact`, which creates a `contactMessage` document. It holds no references or images, so it passes straight through `MODULES_FRAGMENT`.

## Exports

- `default` — the `module.contact` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/contact.ts`
