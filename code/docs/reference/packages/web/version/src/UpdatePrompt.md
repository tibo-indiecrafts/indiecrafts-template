---
title: "Update prompt"
description: "Banner that tells a visitor a new deploy shipped and offers a reload."
status: stable
---

# Update prompt

> A self-contained "new version available" banner with a safe reload path.

## Purpose

Shows a fixed bottom banner when a new deploy shipped while the tab was open. It
needs no toaster: it is token-styled with `role="status"` and `aria-live`, and
its copy is passed in as props so any app can reuse it. It offers two update
paths: the Reload button, and an automatic reload on the next navigation, which
is a natural break with no unsaved-input risk.

## Exports

- `UpdatePrompt` — the component. Props: `current` (the built build id), optional `endpoint`, optional `intervalMs`, `message`, `reloadLabel`, `dismissLabel`, and optional `reloadOnNavigate` (default `true`).

## Usage

```tsx
import { UpdatePrompt } from "@indiecrafts/packages-web-version/update-prompt";

<UpdatePrompt
  current={buildInfo.commit}
  message="A new version is available."
  reloadLabel="Reload"
  dismissLabel="Dismiss"
/>;
```

## Source

`code/packages/web/version/src/UpdatePrompt.tsx`
