---
title: "App sign-in page"
description: "The public sign-in route for the app surface, rendering Clerk's themed sign-in view."
status: stable
---

# App sign-in page

> Clerk's themed sign-in, centered in the viewport.

## Purpose

Public sign-in route for the `app` surface. It renders the shared `SignInView` (Clerk's themed `<SignIn>`) with the post-sign-in fallback set to home; a `redirect_url` query returns the user to where they were. When Clerk is unconfigured the route calls `notFound()`.

## Exports

- `SignInPage` (default) — the async page component.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/sign-in/[[...sign-in]]/page.tsx`
