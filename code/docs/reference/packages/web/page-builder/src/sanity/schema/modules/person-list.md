---
title: "Person List module"
description: "Sanity schema for the person-list page-builder module."
status: stable
---

# Person List module

> A titled list of referenced people, filtered by locale.

## Purpose

Defines the `module.person-list` block: an optional title and intro, plus an array of references to `person` documents. When the parent document has a language, the reference picker filters people to that locale; language-neutral parents (the `blog` singleton) show every person.

## Exports

- `default` — the `module.person-list` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/person-list.ts`
