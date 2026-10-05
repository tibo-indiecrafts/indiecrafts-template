---
title: "Consent restore script"
description: "Builds the inline snippet that restores a returning visitor's stored consent before Google Analytics sends its first hit."
status: stable
---

# Consent restore script

> A returning visitor who accepted is measured from the first hit — not "denied" on every page.

## Purpose

The website layout's `gtag-init` inline script sets every optional Consent-Mode signal to `denied` by default. Without this snippet, a visitor who accepted would stay "denied" on each new page, because the store only sends an update when a choice is made. `consentRestoreScript` returns the JavaScript that runs right after the default and before `gtag('config')`: it reads the stored record and, when it is for the current version, sends `gtag('consent','update', …)` with the granted categories' signals (required categories always granted). A missing, unreadable or stale record sends nothing, so the banner asks again. Values are JSON-encoded with `<` escaped, so a Sanity value can never close the `<script>`.

## Exports

- `consentRestoreScript({ storageKey, version, categories })` — the snippet (a string).

## Usage

```tsx
import { consentRestoreScript } from "@indiecrafts/packages-web-compliance/consent/consent-restore";

`gtag('consent','default',{…});${consentRestoreScript({ storageKey, version, categories })}gtag('config', id);`;
```

## Source

`code/packages/web/compliance/src/consent/consent-restore.ts`
