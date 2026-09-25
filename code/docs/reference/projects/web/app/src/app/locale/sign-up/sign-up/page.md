---
title: "App sign-up page"
description: "The public sign-up route for the app surface, rendering a self-hosted Clerk sign-up view."
status: stable
---

# App sign-up page

> Self-hosted Clerk sign-up that carries the active locale.

## Purpose

Public sign-up route for the `app` surface. It renders the shared `SignUpView` (Clerk's themed `<SignUp>`), self-hosted so it can carry the active `locale` in `unsafeMetadata` and pass a marketing opt-in label. When Clerk is unconfigured the route calls `notFound()`.

## Exports

- `SignUpPage` (default) — the async page component.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/sign-up/[[...sign-up]]/page.tsx`
