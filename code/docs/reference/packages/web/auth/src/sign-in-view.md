---
title: "Sign-in view"
description: "Clerk's prebuilt sign-in card, themed from the design tokens."
status: stable
---

# Sign-in view

> The app's token-themed sign-in surface.

## Purpose

Renders Clerk's prebuilt `<SignIn>` themed with `authAppearance()`, with the post-sign-in fallback set to the app home. Clerk honors a `redirect_url` query param itself, so a user bounced from a protected page returns there. Mount it on a catch-all route.

## Exports

- `SignInView({ home? })` — the sign-in surface; `home` defaults to `/`.

## Usage

```tsx
import { SignInView } from "@indiecrafts/packages-web-auth";

export default function Page() {
  return <SignInView home="/" />;
}
```

## Source

`code/packages/web/auth/src/sign-in-view.tsx`
