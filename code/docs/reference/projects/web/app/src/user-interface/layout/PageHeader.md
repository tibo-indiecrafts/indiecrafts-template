---
title: "Page header"
description: "A page-level heading with a title, optional description, and optional right-aligned actions."
status: stable
---

# Page header

> Page-level heading: title, optional description, optional actions.

## Purpose

Renders the standard page heading used by the app surface's pages. It shows a title, an optional description below it, and an optional row of right-aligned action nodes.

## Exports

- `PageHeader` — the heading component. Props: `title` (string), `description` (optional string), `actions` (optional `ReactNode`).

## Usage

```tsx
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

<PageHeader
  title="Account"
  description="Manage your preferences."
  actions={<Button>Save</Button>}
/>;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/PageHeader.tsx`
