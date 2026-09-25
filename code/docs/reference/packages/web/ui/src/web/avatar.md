---
title: "Avatar"
description: "shadcn/ui avatar with image, fallback, status badge, and group stacking."
status: stable
---

# Avatar

> A user image with a text fallback, an optional badge, and group stacking.

## Purpose

A CLI-managed shadcn/ui primitive built on Radix Avatar. It renders an image with a fallback, supports `default` / `sm` / `lg` sizes, and adds a status badge plus a stacked-group layout with an overflow count. Do not hand-edit; `shadcn add` regenerates it.

## Exports

- `Avatar` — the Radix root; accepts `size` of `default`, `sm`, or `lg`.
- `AvatarImage` — the image.
- `AvatarFallback` — shown while the image is missing or loading.
- `AvatarBadge` — a status dot anchored to the corner.
- `AvatarGroup`, `AvatarGroupCount` — overlapping stack and its overflow count.

## Usage

```tsx
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@indiecrafts/packages-web-ui/web/avatar";

<Avatar>
  <AvatarImage src="/me.jpg" alt="Ada" />
  <AvatarFallback>AD</AvatarFallback>
</Avatar>;
```

## Source

`code/packages/web/ui/src/web/avatar.tsx`
