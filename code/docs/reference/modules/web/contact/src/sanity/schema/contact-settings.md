---
title: "Contact settings schema"
description: "Sanity singleton holding the editor enabled toggle and per-locale contact form copy."
status: stable
---

# Contact settings schema

> The editor-configurable layer over the `features.contact` code flag.

## Purpose

This schema defines the `contactSettings` singleton. The code flag `features.contact` is the hard on/off; this is the editor-configurable layer — an `enabled` toggle plus per-locale form copy for the `/contact` page (heading, description, email placeholder, field labels, button, consent text, success and error messages) and a `seo` block. Off hides the page and every contact block (`MODULES_FRAGMENT` carries the switch). The two emails (confirmation to the sender and owner alert) live on the shared `emailStrings` singleton, not here. Read via `getContactSettings()`.

## Exports

- default — the `contactSettings` singleton document type definition (`defineType`).

## Usage

```ts
import contactSettings from "@indiecrafts/modules-web-contact/sanity/schema/contact-settings";

export const schemaTypes = [contactSettings];
```

## Source

`code/modules/web/contact/src/sanity/schema/contact-settings.ts`
