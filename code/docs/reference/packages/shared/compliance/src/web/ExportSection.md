---
title: "Export section"
description: "The shared 'Download my data' section that drives the export request."
status: stable
---

# Export section

> One button that requests a data export and opens the download.

## Purpose

The shared "Download my data" section (web, shadcn), Clerk- and Next-free. It takes `getToken` and `apiUrl` as props and drives `requestExport`; copy is injected. On success it opens the returned download URL in a new tab.

## Exports

- `ExportSectionProps` (interface) — the props (`copy`, `apiUrl`, `getToken`, optional `onExported`).
- `ExportSection` — the export button plus status component.

## Usage

```tsx
import { ExportSection } from "@indiecrafts/packages-shared-compliance/web";

<ExportSection copy={exportCopy} apiUrl={apiUrl} getToken={getToken} />;
```

## Source

`code/packages/shared/compliance/src/web/ExportSection.tsx`
