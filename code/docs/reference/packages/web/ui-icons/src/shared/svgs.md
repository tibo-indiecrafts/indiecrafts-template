---
title: "Custom SVG registry"
description: "Registry of project-specific SVG marks that are not in lucide, as pure path data."
status: stable
---

# Custom SVG registry

> The registry of bespoke, cross-platform SVG marks.

## Purpose

Holds project-specific marks that lucide does not cover, such as a logo mark or a bespoke glyph. Each entry is pure path data (`viewBox` plus `path`, tinted with `currentColor`), so the web and native renderers draw from one source. Drop your own `{ viewBox, path }` here.

## Exports

- `SvgMark` — type for one mark: `viewBox` and `path`.
- `SVGS` — the record of registered custom marks.
- `SvgName` — the union of registered mark names.
- `isSvg` — type guard that narrows a string to `SvgName`.

## Usage

```ts
import { SVGS, isSvg } from "@indiecrafts/packages-web-ui-icons/shared";

const mark = SVGS["logo-mark"]; // { viewBox: "0 0 24 24", path: "M12 2 L22 20 L2 20 Z" }
const known = isSvg("logo-mark"); // true
```

## Source

`code/packages/web/ui-icons/src/shared/svgs.ts`
