---
title: "Admin page header"
description: "Page-level heading with a title, optional description, and optional actions."
status: stable
---

# Admin page header

> A page title, description, and actions row.

## Purpose

The consistent page-level heading used across dashboard pages. It renders a title, an optional description, and an optional right-aligned actions slot.

## Exports

- `PageHeader` — component taking `title`, optional `description`, and optional `actions`.

## Usage

```tsx
import { PageHeader } from "@/user-interface/layout/PageHeader";

<PageHeader title={t("title")} description={t("description")} />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/PageHeader.tsx`
