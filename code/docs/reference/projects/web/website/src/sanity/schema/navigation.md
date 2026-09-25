---
title: "Navigation schema"
description: "The Sanity singleton schema for the header menu and footer columns, with per-language labels."
status: stable
---

# Navigation schema

> The `navigation` singleton — header menu and footer columns.

## Purpose

Defines the single, language-independent `navigation` singleton (`_id: navigation`) that owns the header menu and the footer columns. One shared structure; each link's label is a `localeString`, so reordering or renaming a menu item changes every language at once. It is the sole runtime source for the menus, with no config fallback — empty means the header shows just the logo and the footer just the social block.

## Exports

- `default` — the `navigation` document type definition (a Sanity `defineType`).

## Source

`code/projects/web/surfaces/website/src/sanity/schema/navigation.ts`
