---
title: "Shared ESLint config"
description: "The ESLint flat config every Next web surface shares."
status: stable
---

# Shared ESLint config

> Next + TypeScript, every jsx-a11y rule as an error, routing only through @/i18n/routing.

## Purpose

`webEslintConfig({ ignores })` returns the flat config for a Next web surface. It extends `eslint-config-next` (core-web-vitals + TypeScript) and enumerates every `jsx-a11y` rule as an error, so a future `eslint-config-next` downgrade cannot silently weaken accessibility (WCAG 2.1 AA is the baseline). It forbids `next/link` and `next-intl/navigation` (use `@/i18n/routing`), except in `src/i18n/routing.ts`, and ignores the build outputs. A surface adds its own paths through `ignores`.

## Exports

- `webEslintConfig({ ignores? })` — the flat config array.

## Source

`code/packages/web/quality-config/src/eslint.mjs`
