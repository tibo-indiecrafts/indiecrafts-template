---
title: "Attachment"
description: "shadcn/ui file-attachment chip showing an upload's media, title, state, and actions."
status: stable
---

# Attachment

> A file chip that shows an upload's preview, name, state, and actions.

## Purpose

A CLI-managed shadcn/ui primitive. It composes a file attachment out of media, content, and action slots, with `size` and `orientation` variants and an upload `state` (`idle`, `uploading`, `processing`, `error`, `done`). `AttachmentGroup` lays several out in a horizontal scroller. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Attachment` — the container; accepts `state`, `size`, and `orientation`.
- `AttachmentGroup` — a horizontally scrolling row of attachments.
- `AttachmentMedia` — the preview area; accepts `variant` of `icon` or `image`.
- `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription` — text slots.
- `AttachmentActions`, `AttachmentAction` — action buttons.
- `AttachmentTrigger` — a full-cover click target; supports `asChild`.

## Usage

```tsx
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
} from "@indiecrafts/packages-web-ui/web/attachment";

<Attachment state="done">
  <AttachmentMedia />
  <AttachmentContent>
    <AttachmentTitle>report.pdf</AttachmentTitle>
    <AttachmentDescription>1.2 MB</AttachmentDescription>
  </AttachmentContent>
</Attachment>;
```

## Source

`code/packages/web/ui/src/web/attachment.tsx`
