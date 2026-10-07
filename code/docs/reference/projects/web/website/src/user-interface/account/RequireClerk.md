---
title: "Require Clerk"
description: "Guard for a page's Clerk UI: renders it under a loaded Clerk, or reloads once to get Clerk."
status: stable
---

# Require Clerk

> Sign-in, sign-up and account still work when reached by a client-side navigation.

## Purpose

The locale layout decides on the server whether to mount Clerk (`shouldLoadClerk`). A client-side navigation keeps the layout as first rendered, so a visitor who arrived signed out and then follows an in-app link to `/sign-in` (or to `/account` after signing in from another tab) has no Clerk above the page, and Clerk's components would throw. `RequireClerk` renders its children only when `useClerkActive()` is true; otherwise it renders nothing and reloads the page once, and the layout then renders with Clerk. A `sessionStorage` flag stops a reload loop.

## Exports

- `RequireClerk({ children })` — wraps the Clerk UI of the sign-in, sign-up and account pages.

## Source

`code/projects/web/surfaces/website/src/user-interface/account/RequireClerk.tsx`
