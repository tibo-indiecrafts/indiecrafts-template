---
title: "Sidebar card"
description: "Frames one sidebar block as a card."
status: stable
---

# Sidebar card

> The card frame around one block in a sidebar.

## Purpose

`SidebarCard` wraps one sidebar block in a card: `bg-card` with the hairline ring of the site's cards. It skips the frame for block types that draw their own card, such as `module.callout` and the form blocks. The card and stat lists get the frame: their hairline grid shows no edge with one item. The wrapper is a `@container`, so the block sizes to the card, not to the screen. It drops the block's outer margin, because the sidebar grid spaces the cards. The rule is `*:my-0!`: without `!`, a responsive block margin such as `md:my-12` wins. A block that renders nothing leaves no empty card (`empty:hidden`).

## Exports

- `SidebarCard` — takes `type` (the block's `_type`), an optional `className` and `children`.

## Usage

```tsx
import { SidebarCard } from "@indiecrafts/packages-web-ui-components/web/layout/SidebarCard";

<SidebarCard type={block._type}>{renderBlock(block)}</SidebarCard>;
```

## Source

`code/packages/web/ui-components/src/web/layout/SidebarCard.tsx`
