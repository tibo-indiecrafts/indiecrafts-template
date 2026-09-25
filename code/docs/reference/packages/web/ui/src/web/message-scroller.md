---
title: "Message scroller"
description: "An autoscrolling message viewport with a jump-to-latest button."
status: stable
---

# Message scroller

> A scroll container for message lists that pins to the newest item and offers a jump button.

## Purpose

A shadcn/ui primitive built on the `@shadcn/react/message-scroller` package. It renders a viewport that autoscrolls to the latest message, virtualizes items with content-visibility, and shows a floating button to scroll back to the start or end.

## Exports

- `MessageScrollerProvider` — context provider for scroller state.
- `MessageScroller` — the root wrapper.
- `MessageScrollerViewport` — the scrollable viewport.
- `MessageScrollerContent` — the column of items inside the viewport.
- `MessageScrollerItem` — one message wrapper; takes `scrollAnchor`.
- `MessageScrollerButton` — the floating scroll-to-end/start button; takes `direction`, `variant`, `size`.
- `useMessageScroller` — hook for the scroller context.
- `useMessageScrollerScrollable` — hook reporting whether the viewport can scroll.
- `useMessageScrollerVisibility` — hook reporting item visibility.

## Usage

```tsx
import {
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@indiecrafts/packages-web-ui/web/message-scroller";

export function Thread({ messages }: { messages: string[] }) {
  return (
    <MessageScroller className="h-96">
      <MessageScrollerViewport>
        <MessageScrollerContent>
          {messages.map((text, i) => (
            <MessageScrollerItem key={i}>{text}</MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton direction="end" />
    </MessageScroller>
  );
}
```

## Source

`code/packages/web/ui/src/web/message-scroller.tsx`
