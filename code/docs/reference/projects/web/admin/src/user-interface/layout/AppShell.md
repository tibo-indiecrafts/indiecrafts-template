---
title: "Admin app shell"
description: "The sidebar-and-header dashboard shell every admin page renders inside."
status: stable
---

# Admin app shell

> The frame around every dashboard page.

## Purpose

The dashboard shell composed of the sidebar, a sticky header, and a toast region. Every `(dashboard)` page renders its content inside this shell.

## Exports

- `AppShell` — component taking `children` (the page content).

## Usage

```tsx
import { AppShell } from "@/user-interface/layout/AppShell";

<AppShell>{children}</AppShell>;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/AppShell.tsx`
