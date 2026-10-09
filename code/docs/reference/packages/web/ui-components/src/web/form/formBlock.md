---
title: "Form block gate"
description: "The server-side gate and prop clean-up every form block wrapper shares."
status: stable
---

# Form block gate

> One gate for the four form block wrappers: the code flag, the Studio switch, the props.

## Purpose

`formBlock(feature, props)` returns the props for a form block's client form, or `null` when the
block must not render. It hides the block when the app's code flag is off (`configureBlocks`) or
when the feature's Studio switch is `false` (`enabled`, projected by `MODULES_FRAGMENT`). It drops
what a client form can't or needn't receive: the `components` render-function map and `inline`
flag that `renderBlock` injects, and `enabled`.

## Exports

- `formBlock(feature, props)` — `Omit<props, "enabled">` or `null`.

## Usage

```tsx
export function Contact(props: ContactModule) {
  const form = formBlock("contact", props);
  return form ? <ContactForm {...form} /> : null;
}
```

## Source

`code/packages/web/ui-components/src/web/form/formBlock.ts`
