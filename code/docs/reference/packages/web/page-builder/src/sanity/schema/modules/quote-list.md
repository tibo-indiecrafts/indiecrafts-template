---
title: "Quote List module"
description: "Sanity schema for the quote-list page-builder module."
status: stable
---

# Quote List module

> A titled list of referenced quotes, filtered by locale.

## Purpose

Defines the `module.quote-list` block: an optional title plus a required array (at least one) of references to `quote` documents. When the parent document has a language, the reference picker filters quotes to that locale; language-neutral parents (the `blog` singleton) show every quote.

## Exports

- `default` — the `module.quote-list` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/quote-list.ts`
