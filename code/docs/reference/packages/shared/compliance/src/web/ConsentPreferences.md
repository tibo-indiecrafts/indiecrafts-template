---
title: "Consent preferences"
description: "The presentational per-category consent toggle switches used by the banner and account tab."
status: stable
---

# Consent preferences

> The per-category toggle list; the parent owns the state.

## Purpose

The per-category consent toggles (web, shadcn). Presentational and controlled — the parent (`ConsentBanner` or the account tab) owns the `choices` state and any Save button. Required categories render as an always-on, disabled switch. Copy is injected.

## Exports

- `ConsentPreferences` — the toggle list component (`categories`, `choices`, `onChange`, `className`).

## Usage

```tsx
import { ConsentPreferences } from "@indiecrafts/packages-shared-compliance/web";

<ConsentPreferences
  categories={categories}
  choices={choices}
  onChange={(key, value) => setChoices((c) => ({ ...c, [key]: value }))}
/>;
```

## Source

`code/packages/shared/compliance/src/web/ConsentPreferences.tsx`
