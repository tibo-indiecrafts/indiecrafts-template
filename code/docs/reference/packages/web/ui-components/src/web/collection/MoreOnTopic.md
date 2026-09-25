---
title: "More on topic"
description: "Renders a compact sidebar list of related-topic links."
status: stable
---

# More on topic

> A sidebar list of related-topic links.

## Purpose

Renders a compact "More on this topic" sidebar block: a heading over a list of related links, with an optional footer link. It is sized for a narrow column but width-agnostic via `@container`, and renders nothing with no items.

## Exports

- `MoreOnTopic` — a heading over a list of related links with an optional footer.
- `MoreOnTopicItem` — one link (title, href, optional meta).

## Usage

```tsx
import { MoreOnTopic } from "@indiecrafts/packages-web-ui-components/web/collection/MoreOnTopic";

<MoreOnTopic
  title="More on Engineering"
  items={[{ title: "Scaling Postgres", href: "/blog/scaling-postgres" }]}
  footer={{ label: "See all", href: "/blog/engineering" }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/collection/MoreOnTopic.tsx`
