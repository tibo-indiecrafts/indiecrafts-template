---
title: "Priority slider input"
description: "A native range input for the Studio post priority field."
status: stable
---

# Priority slider input

> The one custom Studio input — a dependency-free range slider.

## Purpose

A custom Sanity Studio input for a post's `priority` field. 0 means ranked by date; higher pins the post toward the top of listings. It uses a native `<input type="range">` with no `@sanity/ui` or Radix, so it stays minimal. A value of 0 is stored as `unset()`, keeping an unranked document clean and falling through to `coalesce(priority, 0)` in the listing order.

## Exports

- `PrioritySlider(props)` — the input component, also the default export. Takes Sanity's `NumberInputProps`.

## Usage

```ts
import { defineField } from "sanity";
import { PrioritySlider } from "@indiecrafts/modules-web-blog/sanity/components/PrioritySlider";

defineField({
  name: "priority",
  type: "number",
  components: { input: PrioritySlider },
});
```

## Source

`code/modules/web/blog/src/sanity/components/PrioritySlider.tsx`
