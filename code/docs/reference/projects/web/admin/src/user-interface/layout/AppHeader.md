---
title: "Admin app header"
description: "Sticky dashboard header with sidebar toggle, breadcrumbs, and theme toggle."
status: stable
---

# Admin app header

> The dashboard's sticky top bar.

## Purpose

The sticky header rendered at the top of every dashboard page. It holds the sidebar toggle, the breadcrumb trail, and a right-aligned theme toggle. An async server component that reads its labels from the `admin` translations.

## Exports

- `AppHeader` — async server component; takes no props.

## Usage

```tsx
import { AppHeader } from "@/user-interface/layout/AppHeader";

<AppHeader />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/AppHeader.tsx`
