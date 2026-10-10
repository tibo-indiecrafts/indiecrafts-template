---
title: "More on topic"
description: "Renders a compact sidebar list of related-topic links."
status: stable
---

# More on topic

> A sidebar list of related-topic links.

## Purpose

Renders a compact "More on this topic" list: a heading over related links, with an optional footer link. It draws no frame: a `SidebarCard` around it draws the card. It renders nothing with no items.

## Exports

- `MoreOnTopic` — a heading over a list of related links with an optional footer.
- `MoreOnTopicItem` — one link (title, href, optional meta).

## Usage

```tsx
import { MoreOnTopic } from "@indiecrafts/packages-web-ui-components/web/collection/MoreOnTopic";

<SidebarCard type="module.blog-related">
  <MoreOnTopic
    title="More on Engineering"
    items={[{ title: "Scaling Postgres", href: "/blog/scaling-postgres" }]}
    footer={{ label: "See all", href: "/blog/engineering" }}
  />
</SidebarCard>;
```

## Source

`code/packages/web/ui-components/src/web/collection/MoreOnTopic.tsx`
