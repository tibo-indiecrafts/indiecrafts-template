---
title: "App PostCSS config"
description: "PostCSS configuration for the app surface, loading the Tailwind v4 PostCSS plugin."
status: stable
---

# App PostCSS config

> Wires the Tailwind v4 PostCSS plugin for the `app` surface's CSS pipeline.

## Purpose

Configures PostCSS for `@indiecrafts/web-surfaces-app`. It registers the single `@tailwindcss/postcss` plugin, which is how Tailwind v4 processes the app's stylesheets.

## Exports

- `default` — the PostCSS config object with the `@tailwindcss/postcss` plugin.

## Source

`code/projects/web/surfaces/app/postcss.config.mjs`
