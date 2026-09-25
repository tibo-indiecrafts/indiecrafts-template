---
title: "Mobile sign-in screen"
description: "The mobile auth screen — email-code sign-in/sign-up plus Google SSO over Clerk."
status: stable
---

# Mobile sign-in screen

> The mobile auth screen: email-code and Google sign-in over Clerk.

## Purpose

The auth route. Without Clerk configured it shows a not-configured card. When configured, a signed-in user sees continue, account, and sign-out actions; a signed-out user gets the email-code form. The form sends a code (existing user → sign-in, otherwise → sign-up carrying the app locale and a marketing opt-in), verifies it, and offers Google SSO. Step, mode, busy, and error state come from the pure `signInReducer`; wrong OTP attempts are logged at the edge.

## Exports

- `default` — the `SignInScreen` component, rendered by Expo Router at `/sign-in`.

## Source

`code/projects/mobile/surfaces/main/app/sign-in.tsx`
