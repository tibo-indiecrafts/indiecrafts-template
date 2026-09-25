---
title: "Sign-in page"
description: "Public Clerk sign-in route, gated on Clerk being configured."
status: stable
---

# Sign-in page

> The `/sign-in` catch-all route — Clerk's themed sign-in view.

## Purpose

Server route for `/<locale>/sign-in/*`. It renders Clerk's themed `SignInView` with the post-sign-in fallback set to home; a `redirect_url` query returns the user to where they were bounced from. Login is optional on the website (no gate). When Clerk is unconfigured (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` unset) the route 404s.

## Exports

- `SignInPage` (default) — the async server component; calls `notFound()` when Clerk is off.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/sign-in/[[...sign-in]]/page.tsx`
