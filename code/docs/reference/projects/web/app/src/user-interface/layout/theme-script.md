---
title: "Theme boot script"
description: "A tiny inline script that sets data-theme before paint, from localStorage or the OS preference."
status: stable
---

# Theme boot script

> Sets `data-theme` before paint, avoiding a light/dark flash.

## Purpose

Exports a small string-literal script injected inline (with a nonce) into the document head. It runs before paint, reads `localStorage["app-theme"]`, falls back to the OS `prefers-color-scheme`, and writes the result to `document.documentElement.dataset.theme`. Kept tiny so it stays cheap to inline.

## Exports

- `THEME_SCRIPT` — the inline boot script as a string constant.

## Usage

```tsx
import { THEME_SCRIPT } from "@/user-interface/layout/theme-script";

<script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/theme-script.ts`
