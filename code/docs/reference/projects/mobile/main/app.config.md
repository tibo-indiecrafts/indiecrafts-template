---
title: "Expo app config"
description: "The Expo app config for the mobile surface — name, ids, plugins, and EAS Update feed."
status: stable
---

# Expo app config

> The Expo config for the mobile surface: identity, plugins, and OTA updates.

## Purpose

Defines the `ExpoConfig` for the mobile main surface. It sets the app name, slug, scheme, bundle identifiers, plugins (`expo-router`), typed routes, and the EAS Update feed. Per-client fields are rewritten by `pnpm project:rename`; `owner`, `extra.eas.projectId`, and `updates.url` are filled by `eas init`. The `EAS_PROJECT_ID` placeholder keeps the config typed until you run it.

## Exports

- `default` — the `ExpoConfig` object, consumed by Expo tooling.

## Source

`code/projects/mobile/surfaces/main/app.config.ts`
