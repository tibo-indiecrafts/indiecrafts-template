---
title: "Class name merge"
description: "Merges conditional Tailwind class names and resolves conflicts via clsx and tailwind-merge."
status: stable
---

# Class name merge

> Conditional, conflict-free Tailwind class merger.

## Purpose

The standard class-name helper used across the web UI. It runs `clsx` for conditional class values, then `tailwind-merge` to drop conflicting Tailwind utilities, so the last one wins.

## Exports

- `cn` — merges any number of `clsx` class values into one conflict-free string.

## Usage

```ts
import { cn } from "@indiecrafts/packages-shared-utils/cn";

const className = cn("px-2 py-1", isActive && "bg-brand", "px-4");
// "py-1 bg-brand px-4"
```

## Source

`code/packages/shared/utils/src/cn.ts`
