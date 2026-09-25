---
title: "Dialog"
description: "A styled modal dialog built on the Radix dialog primitive."
status: stable
---

# Dialog

> Modal dialog with overlay, centered content, header/footer slots, and a close button.

## Purpose

`Dialog` wraps the Radix dialog parts with the design-system overlay, content, and animation tokens. `DialogContent` portals its children over a dimming overlay and renders an optional close button in the corner. Header, footer, title, and description are provided as slot components.

## Exports

- `Dialog` — the root; controls open state.
- `DialogTrigger` — opens the dialog.
- `DialogClose` — closes the dialog.
- `DialogContent` — the portalled, centered surface; accepts `showCloseButton`.
- `DialogOverlay` — the dimming backdrop.
- `DialogPortal` — portals the content.
- `DialogHeader` — the header layout slot.
- `DialogFooter` — the footer layout slot; accepts `showCloseButton` to render a default Close button.
- `DialogTitle` — the accessible title.
- `DialogDescription` — the accessible description.

## Usage

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@indiecrafts/packages-web-ui/web/dialog";

export function Confirm() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
```

## Source

`code/packages/web/ui/src/web/dialog.tsx`
