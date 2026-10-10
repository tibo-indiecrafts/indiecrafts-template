---
title: "With sidebar"
description: "Lays out a page's main content beside a sidebar of cards."
status: stable
---

# With sidebar

> Main content beside a labelled `<aside>` of cards.

## Purpose

`WithSidebar` places the main content and then an `<aside>` of cards. With no `aside`, it renders the children unchanged, so a page with no sidebar keeps its full-width layout.

- From `lg`, it uses two columns: the content and an 18rem sidebar. The cards stick below the header and scroll on their own when they are taller than the screen. The scroll box has a 4px inset, offset by a negative margin, so it does not clip the cards' rings and focus rings.
- Below `lg`, the cards follow the content, two per row from `sm`. The DOM order is the reading order, so a screen reader and a phone get the content first.
- `contained` (default `true`) adds the page container (max width and gutters) and sets the inner sections' gutter to zero. Pass `false` when the host is already in a container.

A visually hidden `<h2>` gives the `<aside>` its accessible name from `label`.

## Exports

- `WithSidebar` — takes `aside`, `label`, optional `contained` and `className`, and `children`.

## Usage

```tsx
import { WithSidebar } from "@indiecrafts/packages-web-ui-components/web/layout/WithSidebar";

<WithSidebar aside={cards} label={t("sidebar")}>
  <article>{content}</article>
</WithSidebar>;
```

## Source

`code/packages/web/ui-components/src/web/layout/WithSidebar.tsx`
