---
title: "Data export section (native)"
description: "The Clerk-free 'Download my data' section for React Native."
status: stable
---

# Data export section (native)

> The native "Download my data" section, driving the same export as the web sibling.

## Purpose

Renders the "Download my data" section in React Native. It is Clerk-free and drives the same `requestExport` call as the web sibling. It takes `getToken` and `apiUrl` as props, and its copy is injected — no react-intl inside. On success it opens the returned URL and fires `onExported`.

## Exports

- `ExportSection` — the export-section component.
- `ExportSectionProps` — its props type: `copy`, `apiUrl`, `getToken`, optional `onExported`.

## Usage

```tsx
import { ExportSection } from "@indiecrafts/packages-shared-compliance/native";

<ExportSection copy={copy} apiUrl={apiUrl} getToken={getToken} />;
```

## Source

`code/packages/shared/compliance/src/native/ExportSection.tsx`
