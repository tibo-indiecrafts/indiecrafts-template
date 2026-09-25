---
title: "Mobile account screen"
description: "The signed-in account screen — native cookie preferences plus web hand-offs."
status: stable
---

# Mobile account screen

> The signed-in account screen: cookie preferences and web hand-offs.

## Purpose

The signed-in account route. Without Clerk configured, a direct deep link redirects home. When signed in, it renders the shared `ConsentPreferences` panel over the one `consentStore`, a save button that persists the current `policyVersion`, and — when `accountUrl` is set — in-app browser hand-offs for email preferences and full account management (profile, security, export, deletion), which live on the canonical web account.

## Exports

- `default` — the `AccountScreen` component, rendered by Expo Router at `/account`.

## Source

`code/projects/mobile/surfaces/main/app/account.tsx`
