---
title: "Toaster"
description: "The Sonner toast host, themed to the design tokens with status icons."
status: stable
---

# Toaster

> The Sonner toast host, wired to the app theme and token colours.

## Purpose

`Toaster` is a shadcn/ui primitive. It renders the Sonner `Toaster`, reads the
active theme from `next-themes`, sets per-status icons (success, info, warning,
error, loading), and maps its colours to the design tokens. Mount it once near
the app root; fire toasts with `toast()` from `sonner`.

## Exports

- `Toaster` — the themed Sonner host; forwards all Sonner `ToasterProps`.

## Usage

```tsx
import { Toaster } from "@indiecrafts/packages-web-ui/web/sonner";
import { toast } from "sonner";

<Toaster />;
toast.success("Saved");
```

## Source

`code/packages/web/ui/src/web/sonner.tsx`
