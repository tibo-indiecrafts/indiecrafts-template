---
title: "Font file registry"
description: "Metadata registry describing the self-hosted .woff2 font files, one entry per FontKey."
status: stable
---

# Font file registry

> The single registry of self-hosted font files and their CSS descriptors.

## Purpose

This is the barrel of `@indiecrafts/packages-shared-ui-fonts`. It describes the self-hosted `.woff2` files that live in `../fonts/`, so every surface ships fonts from one place. The web app points `next/font` `localFont` at the file paths.

## Exports

- `FontFile` — type for one font file: `path` (relative to the package root), `weight`, and `style`.
- `FONT_FILES` — the self-hosted font files keyed by `FontKey`. Google-served families carry no file and are absent.

## Usage

```ts
import { FONT_FILES } from "@indiecrafts/packages-shared-ui-fonts";

const satoshi = FONT_FILES.satoshi;
// [{ path: "fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }, ...]
```

## Source

`code/packages/shared/ui-fonts/src/index.ts`
