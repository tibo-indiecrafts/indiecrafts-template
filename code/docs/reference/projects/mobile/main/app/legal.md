---
title: "Mobile legal screen"
description: "A link-out screen that opens each canonical legal page in the system browser."
status: stable
---

# Mobile legal screen

> Links out to the website's canonical legal pages.

## Purpose

The legal route. The canonical legal pages live on the marketing website, so this screen renders one button per `LEGAL_PAGE_KEYS` entry; each opens its page in the system browser with `Linking.openURL(legalUrl(...))`. No content is re-hosted, and every button is disabled when no website origin is set.

## Exports

- `default` — the `Legal` screen component, rendered by Expo Router at `/legal`.

## Source

`code/projects/mobile/surfaces/main/app/legal.tsx`
