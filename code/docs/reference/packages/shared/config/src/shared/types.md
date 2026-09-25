---
title: "Config types"
description: "The shared config types — locale, theme, font, environment, and logging shapes — with no data or env."
status: stable
---

# Config types

> Types only for the shared config core.

## Purpose

Holds the config types only — no data, no functions, no `process.env`. The matching data and helpers live in the per-concern modules (`./site`, `./i18n`, `./pages`). `Locale` is derived from the `i18n.locales` data via a type-only import, so the `types` and `i18n` cycle is types-only and safe.

## Exports

- `LocaleConfig` — one registered language row: `code`, `label`, `abbr`, `dir`, and the optional formatting rules (`numberLocale`, `currency`, `capitalizeInlineNouns`, `adjBeforeNoun`).
- `Locale` — the union of registered locale codes, derived from `i18n.locales`.
- `ThemeName`, `ThemeMode` — `"light"` or `"dark"`.
- `FontKey`, `FontRoles` — the font registry keys and the active pairing per role.
- `Environment` — `"development"`, `"test"`, `"staging"`, or `"production"`.
- `LogLevel` — log severities from `trace` to `fatal`, plus `silent`.
- `LoggingConfig` — the logging config shape (`levels` per environment plus `redactKeys`).

## Source

`code/packages/shared/config/src/shared/types.ts`
