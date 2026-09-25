---
title: "Async story helper"
description: "Renders an async server-component renderer inside Storybook's client runtime."
status: stable
---

# Async story helper

> A story-only wrapper that unwraps an async renderer with React 19's `use()`.

## Purpose

`Async` is a story-only helper. Storybook does not resolve async server
components on its own, so `Async` calls the component as a function (producing a
promise of its JSX) and unwraps it with React 19's `use()`. It caches the
promise so `use()` does not re-invoke on every render; a new promise is created
only when `deps` change. Wrap the story in `<Suspense>`.

## Exports

- `Async` — a component. Props: `produce` (`() => Promise<ReactNode>`) and `deps` (a `DependencyList` that controls when the promise is recreated).

## Usage

```tsx
import { Suspense } from "react";
import { Async } from "@indiecrafts/packages-web-ui-components/web/_async-story";

render: (args) => (
  <Suspense fallback={null}>
    <Async
      produce={() => CodeBlock(args)}
      deps={[JSON.stringify(args.value)]}
    />
  </Suspense>
);
```

## Source

`code/packages/web/ui-components/src/web/_async-story.tsx`
