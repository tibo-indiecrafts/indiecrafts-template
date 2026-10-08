---
title: "Waitlist desk structure"
description: "Builds the 'Liste d'attente' Studio desk — the settings singleton and the entries lists."
status: stable
---

# Waitlist desk structure

> The waitlist's Studio desk section: the settings singleton and the entries lists.

## Purpose

Produces the waitlist desk section: the settings singleton editor plus an "Inscrit·e·s" list. The top "Tous·tes" list is a `documentTypeList`; the per-status sub-lists (waiting, invited) are read views. Entries come only from the site's form, on a dotted private id. The website's `sanity.config.ts` removes "create" and "duplicate" for this type. Feature-gating is the app's job — the module factory returns an empty section when `features.waitlist` is off.

## Exports

- `waitlistStructure(S)` — returns the desk `ListItemBuilder[]` for the settings singleton and the entries list.

## Usage

```ts
import { waitlistStructure } from "@indiecrafts/modules-web-waitlist/sanity/structure";

const items = enabled ? waitlistStructure(S) : [];
```

## Source

`code/modules/web/waitlist/src/sanity/structure.ts`
