---
title: "App home page"
description: "The app surface home page with account and legal cards and share buttons."
status: stable
---

# App home page

> The app surface landing page.

## Purpose

The app home. A server component kept statically rendered via `setRequestLocale`. It shows an editor-owned welcome from Sanity (live and cached, falling back to the message file), cards linking to the account and legal pages, and a row of share buttons.

## Exports

- `default` — the `Home` route component.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/(app)/page.tsx`
