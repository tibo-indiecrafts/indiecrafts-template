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

- `authAppearance()` — returns the Clerk `appearance` object whose color and radius variables reference `var(--...)` design tokens. `elements.headerTitle` puts Clerk's page and card titles on the type scale (`--text-lg`, semibold) — the account widget's custom pages use the same size. `elements.profileSection__danger` hides Clerk's own "Delete account" (Security tab) — deletion goes through the account widget's "Your data" page (step-up re-check, exit survey, erasure engine). `elements.badge` sets badge text ("Primary", "This device") to `var(--muted-foreground)`: Clerk's default tint is #dedede on white (contrast 1.3). `elements.socialButtonsRoot` and `elements.dividerRow` hide social sign-in (and its "or" divider) under `html[data-native-shell]` — the app's `NativeBridge` sets it inside the Capacitor shell. There, a social button leaves for the system browser and the session lands there; Google also refuses OAuth in an embedded web view. The website and a browser keep them.

## Usage

```tsx
import { authAppearance } from "@indiecrafts/packages-web-auth";

<ClerkProvider appearance={authAppearance()}>{children}</ClerkProvider>;
```

## Source

`code/packages/web/auth/src/appearance.ts`
