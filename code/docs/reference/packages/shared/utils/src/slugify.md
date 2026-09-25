---
title: "Heading slugifier"
description: "Turns heading text into a deterministic, ASCII-only, hyphen-joined slug for anchor ids."
status: stable
---

# Heading slugifier

> A deterministic, ASCII-only slug for heading anchors and the table of contents.

## Purpose

Used by the PortableText renderer to give each `<h2>` and `<h3>` an `id`, and by the table of contents to link to it. The output is deterministic, ASCII-only, and hyphen-joined, capped at 80 characters.

## Exports

- `slugify(text)` — normalizes text, strips diacritics, lowercases, and joins with hyphens.

## Usage

```ts
import { slugify } from "@indiecrafts/packages-shared-utils/slugify";

slugify("Café & Croissants");
// "cafe-croissants"
```

## Source

`code/packages/shared/utils/src/slugify.ts`
