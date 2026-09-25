---
title: "Manage preferences button"
description: "A client button that opens the cookie preferences dialog."
status: stable
---

# Manage preferences button

> Opens the cookie preferences dialog from anywhere it is mounted.

## Purpose

A small client component that renders an outline button. On click it calls `openPreferences`, which dispatches the open-preferences event that the consent dialog listens for. Mounted next to the banner and on the cookie declaration table.

## Exports

- `ManagePreferencesButton({ label })` — outline button that opens the preferences dialog.

## Usage

```tsx
import { ManagePreferencesButton } from "@indiecrafts/packages-web-compliance/consent/ManagePreferencesButton";

<ManagePreferencesButton label="Manage preferences" />;
```

## Source

`code/packages/web/compliance/src/consent/ManagePreferencesButton.tsx`
