---
title: "Admin breadcrumbs"
description: "Breadcrumb trail from the active route: an Overview link then the current page label."
status: stable
---

# Admin breadcrumbs

> Overview then the current page, from the active route.

## Purpose

Renders the dashboard breadcrumb trail. It resolves the active route with `activeKey(pathname)` and shows `Overview` (a link) followed by the current page label. On `/` it shows only `Overview`.

## Exports

- `Breadcrumbs` — client component; takes no props.

## Usage

```tsx
import { Breadcrumbs } from "@/user-interface/layout/Breadcrumbs";

<Breadcrumbs />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/Breadcrumbs.tsx`
