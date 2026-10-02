---
title: "Clerk appearance tokens"
description: "Builds the Clerk appearance object from design-token CSS custom properties."
status: stable
---

# Clerk appearance tokens

> Clerk sign-in UI themed from the design tokens, with no hard-coded brand colors.

## Purpose

Maps Clerk's `appearance.variables` to the `@indiecrafts/packages-web-ui-tokens` CSS custom properties. The hosted `<SignIn>` and `<SignUp>` components then follow the app's light/dark and per-client theming automatically.

## Exports

- `authAppearance()` — returns the Clerk `appearance` object whose color and radius variables reference `var(--...)` design tokens. `elements.badge` sets badge text ("Primary", "This device") to `var(--muted-foreground)`: Clerk's default tint is #dedede on white (contrast 1.3).

## Usage

```tsx
import { authAppearance } from "@indiecrafts/packages-web-auth";

<ClerkProvider appearance={authAppearance()}>{children}</ClerkProvider>;
```

## Source

`code/packages/web/auth/src/appearance.ts`
