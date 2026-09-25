---
title: "Consent preferences (native)"
description: "Presentational, controlled per-category consent toggles for React Native."
status: stable
---

# Consent preferences (native)

> The per-category consent toggle list for the Expo shell.

## Purpose

Renders one toggle per consent category in React Native. It is presentational and controlled — the parent (`ConsentBanner`) owns the `choices` state and the Save action. Required categories render as an always-on, disabled switch. Themed from the shared tokens.

## Exports

- `ConsentPreferences` — the toggle-list component. Props: `categories`, `choices`, and the `onChange(key, value)` handler.

## Usage

```tsx
import { ConsentPreferences } from "@indiecrafts/packages-shared-compliance/native";

<ConsentPreferences
  categories={categories}
  choices={choices}
  onChange={(key, value) => setChoice(key, value)}
/>;
```

## Source

`code/packages/shared/compliance/src/native/ConsentPreferences.tsx`
