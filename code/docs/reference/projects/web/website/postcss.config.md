---
title: "PostCSS config (website)"
description: "PostCSS configuration for the website; enables the Tailwind v4 PostCSS plugin."
status: stable
---

# PostCSS config (website)

> Registers the Tailwind v4 PostCSS plugin for the website build.

## Purpose

Configures PostCSS for the website. It registers the single `@tailwindcss/postcss` plugin, which is how Tailwind v4 processes the app's stylesheets during the build.

## Exports

- Default export: the PostCSS config object (`{ plugins: { "@tailwindcss/postcss": {} } }`).

## Source

`code/projects/web/surfaces/website/postcss.config.mjs`
