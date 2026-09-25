---
title: "Textarea"
description: "A styled multi-line text input that grows with its content."
status: stable
---

# Textarea

> A styled, auto-sizing multi-line text input.

## Purpose

`Textarea` is a shadcn/ui primitive. It renders a `<textarea>` with token-based
styling, focus and invalid states, and `field-sizing-content` so it grows with
its content.

## Exports

- `Textarea` — a styled `<textarea>`; merges `className` and forwards all `<textarea>` props.

## Usage

```tsx
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";

<Textarea placeholder="Your message" rows={4} />;
```

## Source

`code/packages/web/ui/src/web/textarea.tsx`
