---
title: "Email desk section"
description: "The Studio desk item for the emailStrings singleton."
status: stable
---

# Email desk section

> The "E-mails" desk section holding the single `emailStrings` singleton.

## Purpose

Builds the "E-mails" list item for the Sanity desk. It opens the `emailStrings` singleton, which holds the config and copy for every transactional email. `composeSanity` stitches this section in with the other owners.

## Exports

- `emailStructure(S)` — takes a `StructureBuilder` and returns a `ListItemBuilder[]` with the email desk section.

## Usage

```ts
import { emailStructure } from "@indiecrafts/packages-web-email/sanity";

structure: (S) => S.list().items([...emailStructure(S)]);
```

## Source

`code/packages/web/email/src/sanity/structure.ts`
