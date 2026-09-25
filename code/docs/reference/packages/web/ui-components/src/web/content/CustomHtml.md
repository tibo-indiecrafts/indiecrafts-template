---
title: "Custom HTML"
description: "Renders editor-authored raw HTML via dangerouslySetInnerHTML."
status: stable
---

# Custom HTML

> An escape hatch for editor-authored HTML.

## Purpose

Renders a `module.custom-html` block: editor-authored markup injected via `dangerouslySetInnerHTML`. It is a trusted-author escape hatch for embeds; the app CSP is the backstop. Any embedded iframe is forced to full column width.

## Exports

- `CustomHtml` — renders editor-authored raw HTML; `width` is `contained` (default) or `full`.

## Usage

```tsx
import { CustomHtml } from "@indiecrafts/packages-web-ui-components/web/content/CustomHtml";

<CustomHtml
  html="<iframe src='https://example.com/embed'></iframe>"
  width="contained"
/>;
```

## Source

`code/packages/web/ui-components/src/web/content/CustomHtml.tsx`
