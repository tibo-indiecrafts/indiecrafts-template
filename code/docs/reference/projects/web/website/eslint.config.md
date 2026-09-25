---
title: "ESLint config"
description: "ESLint flat config for the app, enumerating jsx-a11y rules as errors and restricting router imports."
status: stable
---

# ESLint config

> The app's flat config: strict accessibility, plus a routing import guard.

## Purpose

The production app's ESLint flat config. It extends `eslint-config-next` (core-web-vitals + TypeScript) and enumerates every `jsx-a11y` rule explicitly so a future `eslint-config-next` downgrade cannot silently weaken accessibility coverage — WCAG 2.1 AA is the baseline, and every violation is an error. It also restricts imports from `next/link` and `next-intl/navigation` (steering callers to `@/i18n/routing`), allowing that import only in `src/i18n/routing.ts`, and ignores build-output directories.

## Exports

- `default` — the ESLint flat config array.

## Source

`code/projects/web/surfaces/website/eslint.config.mjs`
