---
title: "Sign-up page"
description: "Public Clerk sign-up route that carries the active locale for localized auth emails."
status: stable
---

# Sign-up page

> The `/sign-up` catch-all route — Clerk's themed, self-hosted sign-up view.

## Purpose

Server route for `/<locale>/sign-up/*`. It renders Clerk's themed `SignUpView`, self-hosted rather than the Account Portal so it can carry the active `locale` in `unsafeMetadata`; the api webhook mirrors that to `user_profiles.locale`, localizing the user's auth emails including the first verification code. Clerk's links point here through the layout's `AppClerkProvider signUpPath="/sign-up"`. The marketing opt-in label comes from `messages.auth`. The route 404s when Clerk is unconfigured.

## Exports

- `SignUpPage` (default) — the async server component; calls `notFound()` when Clerk is off.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/sign-up/[[...sign-up]]/page.tsx`
