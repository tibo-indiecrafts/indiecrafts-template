---
title: "Email palette"
description: "Design tokens resolved to inline hex for email templates."
status: stable
---

# Email palette

> The design tokens resolved to inline hex, because mail clients strip CSS.

## Purpose

Provides the email colour palette. Mail clients strip `<style>`, `var()`, and `<link>`, so the OKLCH tokens in `globals.css` cannot reach an inbox. This file reads the resolved hex mirror (`@indiecrafts/packages-shared-ui-tokens/hex`, light set) and maps it to named roles. Change a token, rebuild with `pnpm tokens:build`, and every email updates from one source.

## Exports

- `EMAIL_COLORS` — a `const` object of resolved hex values keyed by role: `page`, `panel`, `card`, `border`, `heading`, `body`, `muted`, `accent`, `accentForeground`, `destructive`.

## Usage

```ts
import { EMAIL_COLORS } from "@indiecrafts/packages-web-email/theme";

const style = `background:${EMAIL_COLORS.card};color:${EMAIL_COLORS.body}`;
```

## Source

`code/packages/web/email/src/theme.ts`
