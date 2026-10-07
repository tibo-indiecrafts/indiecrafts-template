---
title: "Font registry"
description: "The single place next/font is called; resolves config font roles into html classes and CSS vars."
status: stable
---

# Font registry

> Every font is instantiated here and mapped to the `--font-*` role variables.

## Purpose

`next/font` needs statically-analyzable literal calls, so every Google and local font is instantiated in this module and given its own `--f-<key>` CSS variable. The `config.fonts` role map (display / body / mono) is then resolved into the classes and inline style the `<html>` element uses.

Geist Mono sets `preload: false`: it only shows in code blocks, so preloading it would spend first-load bandwidth on every page. It loads when first used.

## Exports

- `fontClassName` — the deduped `.variable` class list for the fonts in use, applied to `<html>`.
- `fontStyle` — a `CSSProperties` object mapping `--font-display` / `--font-sans` / `--font-mono` to the chosen fonts.

## Usage

```tsx
import { fontClassName, fontStyle } from "@/lib/fonts";

<html className={fontClassName} style={fontStyle}>
  {children}
</html>;
```

## Source

`code/projects/web/surfaces/website/src/lib/fonts.ts`
