---
title: "Alert dialog"
description: "shadcn/ui modal dialog for confirming a destructive or important action."
status: stable
---

# Alert dialog

> A modal that interrupts to confirm an important action.

## Purpose

A CLI-managed shadcn/ui primitive built on Radix AlertDialog. It adds `default` / `sm` content sizes, an optional media slot, and action/cancel buttons wired to the design-system `Button`. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `AlertDialog` — the Radix root.
- `AlertDialogTrigger` — opens the dialog.
- `AlertDialogPortal`, `AlertDialogOverlay` — portal and backdrop.
- `AlertDialogContent` — the panel; accepts `size` of `default` or `sm`.
- `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogMedia` — layout slots.
- `AlertDialogTitle`, `AlertDialogDescription` — labelled text.
- `AlertDialogAction`, `AlertDialogCancel` — buttons that accept `variant` and `size`.

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@indiecrafts/packages-web-ui/web/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>;
```

## Source

`code/packages/web/ui/src/web/alert-dialog.tsx`
