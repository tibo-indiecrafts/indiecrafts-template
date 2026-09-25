---
title: "Contact desk structure"
description: "Builds the contact module's Studio desk section with a settings singleton and a message inbox."
status: stable
---

# Contact desk structure

> The Studio "Contact" desk — settings singleton plus the received-messages inbox.

## Purpose

`contactStructure` builds the contact module's Studio desk section: the `contactSettings` singleton editor and the received-messages inbox. The top "Tous" list is a read-only `documentTypeList` (messages arrive via the API, never created by hand); status sub-lists ("Nouveaux", "Traités") are filtered views ordered by newest first. Feature-gating is the app's job — `contactSanity(enabled)` returns an empty section when `features.contact` is off.

## Exports

- `contactStructure` — takes a `StructureBuilder` and returns `ListItemBuilder[]` (the settings item and the messages item).

## Usage

```ts
import { contactStructure } from "@indiecrafts/modules-web-contact/sanity/structure";

// Called inside the contactSanity SanityModule factory:
// structure: (S) => (enabled ? contactStructure(S) : [])
```

## Source

`code/modules/web/contact/src/sanity/structure.ts`
