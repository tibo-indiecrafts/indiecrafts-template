---
title: "Clerk auth menu"
description: "The header's Clerk control once Clerk is loaded: the account menu, or the sign-in modal button."
status: stable
---

# Clerk auth menu

> What the header shows once Clerk is loaded.

## Purpose

Rendered by `AuthMenu` through `LazyClerkAuthMenu`, so its Clerk code is in its own chunk. Signed in, it shows the account menu (`AccountControl`). Signed out with Clerk still loaded (for example right after signing out, before the next page load), it shows `SignInModalButton`, which opens Clerk's modal with the active locale so an in-modal sign-up keeps the language.

## Exports

- `ClerkAuthMenu` — takes no props; must render under `AppClerkProvider`.

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/ClerkAuthMenu.tsx`
