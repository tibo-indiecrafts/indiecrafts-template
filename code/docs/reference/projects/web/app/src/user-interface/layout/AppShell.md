---
title: "App shell"
description: "The sidebar and sticky-header shell that every app-group page renders inside."
status: stable
---

# App shell

> The sidebar plus sticky-header frame for every `(app)` page.

## Purpose

The app shell that every `(app)` page renders inside: the `AppSidebar` and the sticky `AppHeader` around the page content, inside a `SidebarProvider`. Right under the header it mounts `AnnouncementChrome` (when Clerk is configured), so the signed-in announcement bar and card sit under the navbar. The `Toaster` lives at `[locale]/layout.tsx` (so it covers sign-in too), not here.

## Exports

- `AppShell` — the component. Prop: `children`.

## Usage

```tsx
import { AppShell } from "@/user-interface/layout/AppShell";

<AppShell>{children}</AppShell>;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/AppShell.tsx`
