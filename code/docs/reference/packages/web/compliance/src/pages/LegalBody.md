---
title: "Legal body renderer"
description: "Minimal PortableText renderer for legal-page bodies."
status: stable
---

# Legal body renderer

> Headings, lists, marks, and links only — legal pages stay decoupled from the blog.

## Purpose

A minimal PortableText renderer for legal-page bodies. It supports headings, lists, marks, and links only (no page-builder blocks), styled with design tokens for a readable prose measure. Link hrefs are scheme-whitelisted, so a `javascript:` or `data:` href from a compromised editor never renders.

## Exports

- `LegalBodyValue` — the PortableText value type accepted by the renderer.
- `LegalBody({ value })` — renders the portable text with the legal-page components.

## Usage

```tsx
import { LegalBody } from "@indiecrafts/packages-web-compliance/pages/LegalBody";

<LegalBody value={doc.body} />;
```

## Source

`code/packages/web/compliance/src/pages/LegalBody.tsx`
