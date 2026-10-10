---
title: "Breadcrumbs trail"
description: "Reusable breadcrumb trail whose last item renders as the current, aria-current page."
status: stable
---

# Breadcrumbs trail

> The visual + ARIA trail used by the author and category routes.

## Purpose

`Breadcrumbs` renders a breadcrumb trail. Items are passed in order; the last item renders as plain text (the current page) and gets `aria-current="page"`. It renders the visual and ARIA trail only — the `BreadcrumbList` JSON-LD is emitted separately by each route's page schemas, so the crumbs live in two places on purpose. Link and current-page styling use a hover underline and font-weight rather than hard-coded colors (no opacity, which broke the 4.5:1 contrast), so a passed `className` (for example `text-white/85`) cascades through the whole component for dark hero backgrounds.

## Exports

- `Breadcrumbs` — component taking `{ items, label, className? }`; returns `null` when `items` is empty.
- `Crumb` — type `{ label: string; href?: string }`.

## Usage

```tsx
import {
  Breadcrumbs,
  type Crumb,
} from "@indiecrafts/modules-web-blog/user-interface/shared/components/Breadcrumbs";

const items: Crumb[] = [
  { label: "Blog", href: "/blog" },
  { label: post.title },
];

<Breadcrumbs items={items} label={t("breadcrumbs")} />;
```

## Source

`code/modules/web/blog/src/user-interface/shared/components/Breadcrumbs.tsx`
