---
title: "Font pairing"
description: "Selects which registered font plays each typography role."
status: stable
---

# Font pairing

> Maps the display/body/mono roles to fonts from the `@/lib/fonts` registry.

## Purpose

`fonts` is the app's active font pairing — one registered font (from `@/lib/fonts`) per role. `next/font` needs static loader calls, so the fonts live in the registry and this file just names which plays each role: `display` drives headings (`--font-display`), plus `body` and `mono`. The template ships Satoshi for headings, Geist for body, and Geist Mono for code. Swapping the pairing is a one-line edit here.

## Exports

- `fonts` — a `FontRoles` map of `display` / `body` / `mono` to font keys.

## Usage

```ts
import { fonts } from "@/config";
```

## Source

`code/projects/web/surfaces/website/src/config/fonts.ts`
