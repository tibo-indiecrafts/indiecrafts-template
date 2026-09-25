---
title: "App OpenNext config"
description: "OpenNext Cloudflare adapter config for the app surface, using the framework defaults."
status: stable
---

# App OpenNext config

> Builds the `app` Next.js surface for Cloudflare Workers with the default OpenNext adapter settings.

## Purpose

Configures the OpenNext Cloudflare adapter for `@indiecrafts/web-surfaces-app`. It calls `defineCloudflareConfig()` with no overrides, so the app builds to a Worker with the adapter defaults.

## Exports

- `default` — the result of `defineCloudflareConfig()`.

## Source

`code/projects/web/surfaces/app/open-next.config.ts`
