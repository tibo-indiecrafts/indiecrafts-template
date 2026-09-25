---
title: "Admin theme script"
description: "Pre-paint inline script that sets the theme from localStorage or the OS preference."
status: stable
---

# Admin theme script

> A tiny pre-paint script that avoids a theme flash.

## Purpose

A string-literal script that runs before paint to set `data-theme` from `localStorage["admin-theme"]`, falling back to the `prefers-color-scheme` media query. Kept tiny so it can be injected as a nonce'd inline script.

## Exports

- `THEME_SCRIPT` — the inline script string.

## Usage

```tsx
import { THEME_SCRIPT } from "@/user-interface/layout/theme-script";

<script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/theme-script.ts`
