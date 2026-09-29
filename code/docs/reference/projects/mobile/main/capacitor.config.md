---
title: "Capacitor config"
description: "Configures the Capacitor shell: the app identity, the hosted app URL, and the offline page."
status: stable
---

# Capacitor config

> The shell's whole native configuration — it loads the hosted `app` surface.

## Purpose

Builds the `CapacitorConfig` the Capacitor CLI reads on `cap sync` / `cap run`. The app id and name come from `shell.json`; `server.url` comes from `resolveServerUrl(process.env)`. Cleartext HTTP is allowed only when that URL is `http://` (local dev). `server.errorPath` points at the bundled `offline.html`, and the splash screen stays up until the app's `NativeBridge` hides it.

## Exports

- `default` — the `CapacitorConfig` object.

## Source

`code/projects/mobile/surfaces/main/capacitor.config.ts`
