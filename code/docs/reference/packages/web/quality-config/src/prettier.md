---
title: "Shared Prettier config"
description: "The Prettier config every Next web surface shares."
status: stable
---

# Shared Prettier config

> Double quotes, semicolons, trailing commas, 90 columns, Tailwind classes sorted.

## Purpose

The formatting rules of every Next web surface: `semi`, double quotes, `trailingComma: "all"`, `printWidth: 90`, and `prettier-plugin-tailwindcss` to sort class lists. Each surface's `prettier.config.mjs` re-exports it.

## Exports

- `default` — the Prettier config.

## Source

`code/packages/web/quality-config/src/prettier.mjs`
