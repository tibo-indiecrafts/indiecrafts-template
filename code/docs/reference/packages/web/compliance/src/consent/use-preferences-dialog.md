---
title: "Preferences dialog hook"
description: "React hook holding the open-state of the cookie preferences dialog."
status: stable
---

# Preferences dialog hook

> One place that opens the preferences dialog from the event and the query param.

## Purpose

A client hook that returns the `[open, setOpen]` state for the cookie preferences dialog. It opens the dialog when the open-preferences event fires (from the footer links) and when the URL has `?cookies=manage`. Shared by `CookieBanner` and `CookiePreferencesHost` so the listener lives in one place.

## Exports

- `usePreferencesDialog()` — returns `[open, setOpen]` for the dialog.

## Usage

```tsx
import { usePreferencesDialog } from "@indiecrafts/packages-web-compliance/consent/use-preferences-dialog";

const [open, setOpen] = usePreferencesDialog();
```

## Source

`code/packages/web/compliance/src/consent/use-preferences-dialog.ts`
