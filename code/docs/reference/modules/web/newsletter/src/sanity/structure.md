---
title: "Newsletter desk structure"
description: "Builds the newsletter Studio desk — the settings singleton and the lead magnets."
status: stable
---

# Newsletter desk structure

> The Studio navigation for the newsletter module.

## Purpose

Builds the newsletter module's Studio desk sections: the settings singleton editor and the "Aimants à prospects" lead-magnet list. Subscribers live in Resend, the only list, not in the Studio. Feature-gating is the app's job — `newsletterSanity(enabled)` returns `[]` here when `features.newsletter` is off.

## Exports

- `newsletterStructure(S)` — takes a `StructureBuilder`, returns `ListItemBuilder[]` for the newsletter desk.

## Usage

```ts
import { newsletterStructure } from "@indiecrafts/modules-web-newsletter/sanity/structure";

const items = newsletterStructure(S);
```

## Source

`code/modules/web/newsletter/src/sanity/structure.ts`
