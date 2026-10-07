---
title: "Auth menu"
description: "Header auth control: a plain sign-in link while Clerk isn't loaded, Clerk's menu once it is."
status: stable
---

# Auth menu

> The header's sign-in / account affordance, with no Clerk code until Clerk is needed.

## Purpose

The website loads Clerk only for a signed-in visitor or on the sign-in / sign-up pages (`shouldLoadClerk`). While Clerk isn't loaded (`useClerkActive()` is false), this renders a plain "Sign in" link to the localized `/sign-in` page with `redirect_url` set to the current path. It is a full page load (`<a>`, not the routing `Link`), so the layout renders the sign-in page with Clerk. Once Clerk is loaded it renders `ClerkAuthMenu` through `LazyClerkAuthMenu`. With no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` auth is off and it renders nothing.

## Exports

- `AuthMenu` — the header auth control; takes no props.

## Usage

```tsx
import { AuthMenu } from "@/user-interface/shared/layout/AuthMenu";

<AuthMenu />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/AuthMenu.tsx`
