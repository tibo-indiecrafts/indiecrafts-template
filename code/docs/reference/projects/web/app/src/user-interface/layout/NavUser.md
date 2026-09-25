---
title: "Sidebar user menu"
description: "The sidebar footer menu — Legal link always, plus Sign out when Clerk is configured."
status: stable
---

# Sidebar user menu

> The sidebar footer menu: Legal, plus Sign out when Clerk is configured.

## Purpose

Renders the sidebar footer dropdown. It always shows a Legal link, and adds a Sign out item when Clerk is configured. Account management lives on the embedded `/account` page, so no profile modal is shown here.

## Exports

- `NavUser` — the footer menu component. Takes no props; labels come from `messages.app.user`.

## Usage

```tsx
import { NavUser } from "@/user-interface/layout/NavUser";

<NavUser />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/NavUser.tsx`
