---
title: "Legal page content"
description: "Server component rendering one legal page from its Sanity document."
status: stable
---

# Legal page content

> The editable body of one legal page, app-agnostic.

## Purpose

An async server component that renders the body of one legal page from the editable Sanity `legalPage` doc for a `pageKey` and `locale`. It is app-agnostic: the route shell wraps it in the layout, gates it on the legal feature flags, and emits SEO metadata. On the cookie page it also appends the live cookie declaration table.

## Exports

- `LegalPageContent({ pageKey, locale })` — async server component for one legal page.

## Usage

```tsx
import { LegalPageContent } from "@indiecrafts/packages-web-compliance/pages/LegalPageContent";

<LegalPageContent pageKey="privacy" locale={locale} />;
```

## Source

`code/packages/web/compliance/src/pages/LegalPageContent.tsx`
