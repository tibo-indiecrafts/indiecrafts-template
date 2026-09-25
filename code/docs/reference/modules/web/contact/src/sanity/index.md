---
title: "Contact Sanity module"
description: "Assembles the contact module's Sanity contribution as a feature-gated SanityModule."
status: stable
---

# Contact Sanity module

> One-line activation of the contact module's schema, desk, and email groups in the Studio.

## Purpose

`contactSanity` assembles the contact module's Sanity contribution into a `SanityModule`: the `contactSettings` singleton, the `contactMessage` document, the desk section, and its two `emailStrings` groups. Called with the app's `features.contact`, an `enabled` value of `false` hides the desk section while the schema and email groups still register. Add `contactSanity(features.contact)` to the modules array in `sanity.config.ts`.

## Exports

- `contactSanity` — takes `enabled: boolean` and returns a `SanityModule` (`{ name, schemaTypes, structure, emailGroups }`).

## Usage

```ts
import { contactSanity } from "@indiecrafts/modules-web-contact/sanity";

composeStudio([contactSanity(features.contact)]);
```

## Source

`code/modules/web/contact/src/sanity/index.ts`
