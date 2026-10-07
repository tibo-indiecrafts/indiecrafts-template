---
title: "Lazy Clerk"
description: "Code-split wrappers for every Clerk-dependent piece the layout and header render."
status: stable
---

# Lazy Clerk

> Clerk's code loads only where Clerk renders.

## Purpose

Next bundles every client component that a layout imports into that route's first load, rendered or not. So the layout and the header never import Clerk UI directly: they import these `next/dynamic` wrappers, and each chunk (plus Clerk's own scripts from its CDN) loads only when the piece renders. The locale layout renders them only when `shouldLoadClerk` is true. A signed-out visitor on a marketing page downloads no Clerk code (about 135 kB of JS plus ~300 KiB of ClerkJS).

## Exports

- `LazyClerkProvider` — `AppClerkProvider`; client-side, `ClerkProvider` resolves to Clerk's client provider. The layout wraps `<body>`'s content with it.
- `LazyClerkAuthMenu` — `ClerkAuthMenu`.
- `LazySignedInLegalNotice` — the "policies updated" banner with the cross-surface acceptance sync.
- `LazySessionLogger` — logs session starts to the api.
- `LazyMarketingNudgeMount` — the signed-in marketing-email nudge.

## Source

`code/projects/web/surfaces/website/src/user-interface/account/LazyClerk.tsx`
