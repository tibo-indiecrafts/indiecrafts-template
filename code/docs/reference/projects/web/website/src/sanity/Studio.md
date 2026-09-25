---
title: "Studio wrapper"
description: "A client-component wrapper around NextStudio so the catch-all Studio route can render it from a server component."
status: stable
---

# Studio wrapper

> The `"use client"` boundary that mounts the Sanity Studio.

## Purpose

A client wrapper around `<NextStudio>`. The Studio module hits client-only React APIs (createContext, hooks), so the server route cannot import it directly. The `/studio` catch-all page renders this component, passing the app's `sanity.config`.

## Exports

- `Studio` — the client component that renders `<NextStudio>` with the app config.

## Usage

```tsx
import { Studio } from "@/sanity/Studio";

export default function StudioPage() {
  return <Studio />;
}
```

## Source

`code/projects/web/surfaces/website/src/sanity/Studio.tsx`
