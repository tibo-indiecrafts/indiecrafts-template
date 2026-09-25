---
title: "i18n request config"
description: "The per-request next-intl config that loads the active locale's messages for the app surface."
status: stable
---

# i18n request config

> Loads the active locale's messages from the bundled JSON files.

## Purpose

Per-request i18n config for the `app` surface. It resolves the requested locale (falling back to the default), then loads the chrome from the bundled `messages/<locale>.json`. There is no Sanity overlay: the JSON files are the sole source. next-intl calls this via the plugin in `next.config.ts`.

## Exports

- default — the `getRequestConfig` result that next-intl invokes per request.

## Source

`code/projects/web/surfaces/app/src/i18n/request.ts`
