---
title: "ESLint config"
description: "ESLint flat config for the admin surface — the shared web rules."
status: stable
---

# ESLint config

> The admin surface's ESLint config: the shared web-surface rules, nothing of its own.

## Purpose

Re-exports `webEslintConfig()` from `@indiecrafts/packages-web-quality-config/eslint`: accessibility rules as errors and routing only through `@/i18n/routing`. Change a rule in the brick, for every surface.

## Exports

- `default` — the ESLint flat config array.

## Source

`code/projects/web/surfaces/admin/eslint.config.mjs`
