---
title: "Auth menu"
description: "Header auth control that shows a sign-in button when signed out and the account menu when signed in."
status: stable
---

# Auth menu

> The header's sign-in / account affordance, gated on Clerk being configured.

## Purpose

Renders a "Sign in" button (opens Clerk's modal) when signed out and the account menu when signed in. Only mounts when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set — otherwise the Clerk provider is absent and Clerk's components would throw. Auth is opt-in, so with no key the header looks exactly as before.

## Exports

- `AuthMenu` — the header auth control; takes no props.

## Usage

```tsx
import { AuthMenu } from "@/user-interface/shared/layout/AuthMenu";

<AuthMenu />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/AuthMenu.tsx`
