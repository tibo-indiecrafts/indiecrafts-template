---
title: "Admin OpenNext config"
description: "OpenNext Cloudflare adapter config for the admin surface, using the framework defaults."
status: stable
---

# Admin OpenNext config

> Builds the admin Next.js app for Cloudflare Workers with the default OpenNext adapter settings.

## Purpose

Configures the OpenNext Cloudflare adapter for `@indiecrafts/web-surfaces-admin`. It calls `defineCloudflareConfig()` with no overrides, so the admin app builds to a Worker with the adapter defaults.

## Exports

- `default` — the result of `defineCloudflareConfig()`.

## Source

`code/projects/web/surfaces/admin/open-next.config.ts`
