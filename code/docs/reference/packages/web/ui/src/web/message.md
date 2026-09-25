---
title: "Message row"
description: "Layout slots for a single chat message with avatar, content, header, and footer."
status: stable
---

# Message row

> Composable slots for laying out a chat message and grouping consecutive ones.

## Purpose

A shadcn/ui primitive that provides the layout for a message row. It aligns to `start` or `end`, and splits into avatar, content, header, and footer slots. `MessageGroup` stacks related messages.

## Exports

- `MessageGroup` — a column wrapper for consecutive messages.
- `Message` — one message row; takes `align` (`start` | `end`).
- `MessageAvatar` — the avatar slot, aligned to the row's end.
- `MessageContent` — the message body column.
- `MessageHeader` — a small header line above the content.
- `MessageFooter` — a small footer line below the content.

## Usage

```tsx
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@indiecrafts/packages-web-ui/web/message";

export function IncomingMessage() {
  return (
    <Message align="start">
      <MessageAvatar>AI</MessageAvatar>
      <MessageContent>Here is the summary you asked for.</MessageContent>
    </Message>
  );
}
```

## Source

`code/packages/web/ui/src/web/message.tsx`
