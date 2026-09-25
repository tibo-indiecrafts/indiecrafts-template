---
title: "Spinner"
description: "A spinning loader icon with a status role and accessible label."
status: stable
---

# Spinner

> A spinning loader icon that announces itself as a status.

## Purpose

`Spinner` is a shadcn/ui primitive. It renders the Lucide `Loader2Icon` with a
spin animation, `role="status"`, and `aria-label="Loading"`, for inline loading
states.

## Exports

- `Spinner` — a spinning icon; merges `className` (defaults to `size-4 animate-spin`) and forwards all `<svg>` props.

## Usage

```tsx
import { Spinner } from "@indiecrafts/packages-web-ui/web/spinner";

<Spinner className="size-6" />;
```

## Source

`code/packages/web/ui/src/web/spinner.tsx`
