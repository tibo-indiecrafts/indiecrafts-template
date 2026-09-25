---
title: "Skeleton"
description: "A pulsing placeholder box shown in place of content while it loads."
status: stable
---

# Skeleton

> A pulsing block that stands in for content while it loads.

## Purpose

`Skeleton` is a shadcn/ui primitive. It renders a rounded `<div>` with a pulse
animation, used as a loading placeholder for text, avatars, or cards.

## Exports

- `Skeleton` — a `<div>` with `bg-accent animate-pulse rounded-md`; merges `className` and forwards all `<div>` props.

## Usage

```tsx
import { Skeleton } from "@indiecrafts/packages-web-ui/web/skeleton";

<Skeleton className="h-4 w-32" />;
```

## Source

`code/packages/web/ui/src/web/skeleton.tsx`
