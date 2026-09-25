---
title: "Accordion list block"
description: "Renders an accordion-list module as native details/summary disclosure items."
status: stable
---

# Accordion list block

> The page-builder accordion block, rendered with native `<details>` disclosure.

## Purpose

`AccordionList` renders a `module.accordion-list` block. It shows an optional
`RichTitle` and intro, then a list of items where each is a native `<details>`
disclosure with a Portable Text body. It returns `null` when the module has no
items. It is pure and takes already-resolved Sanity data.

## Exports

- `AccordionList` — the renderer. Props: an `AccordionListModule` plus `components` (the `PortableTextComponents` used for item bodies) and an optional `inline` flag passed to the wrapping `ModuleSection`.

## Usage

```tsx
import { AccordionList } from "@indiecrafts/packages-web-ui-components/web/collection/AccordionList";

<AccordionList
  _key="faq"
  _type="module.accordion-list"
  title="Questions"
  items={items}
  components={portableTextComponents}
/>;
```

## Source

`code/packages/web/ui-components/src/web/collection/AccordionList.tsx`
