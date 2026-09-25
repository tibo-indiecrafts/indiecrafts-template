---
title: "Admin PostCSS config"
description: "PostCSS configuration for the admin surface, loading the Tailwind v4 PostCSS plugin."
status: stable
---

# Admin PostCSS config

> Wires the Tailwind v4 PostCSS plugin for the admin app's CSS pipeline.

## Purpose

Configures PostCSS for `@indiecrafts/web-surfaces-admin`. It registers the single `@tailwindcss/postcss` plugin, which is how Tailwind v4 processes the app's stylesheets.

## Exports

- `default` — the PostCSS config object with the `@tailwindcss/postcss` plugin.

## Source

`code/projects/web/surfaces/admin/postcss.config.mjs`
