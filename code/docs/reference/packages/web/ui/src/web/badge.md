---
title: "Badge"
description: "shadcn/ui inline label with color variants, optionally rendered as a link."
status: stable
---

# Badge

> A small inline status or category label.

## Purpose

A CLI-managed shadcn/ui primitive. It renders a rounded label with several color variants and can render as its child (e.g. a link) via `asChild`. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Badge` — the label; accepts `variant` (`default`, `secondary`, `destructive`, `outline`, `ghost`, `link`) and `asChild`.
- `badgeVariants` — the `cva` class helper, for composing the badge styles elsewhere.

## Usage

```tsx
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";

<Badge variant="secondary">New</Badge>;
```

## Source

`code/packages/web/ui/src/web/badge.tsx`
