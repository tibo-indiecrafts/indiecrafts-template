---
title: "Code block"
description: "Async component that renders a Shiki-highlighted code block."
status: stable
---

# Code block

> A Shiki-highlighted code block.

## Purpose

Renders a body `codeBlock` object as a syntax-highlighted block. Shiki runs server-side with a light and dark theme pair; colours swap under `[data-theme="dark"]`. An unknown language degrades to a plain preformatted block.

## Exports

- `CodeBlock` — async Shiki-highlighted code block; degrades to a plain `<pre>` on an unknown language.

## Usage

```tsx
import { CodeBlock } from "@indiecrafts/packages-web-ui-components/web/content/CodeBlock";

<CodeBlock
  value={{ language: "ts", filename: "index.ts", code: "export const x = 1;" }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/content/CodeBlock.tsx`
