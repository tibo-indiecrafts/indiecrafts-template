---
title: "Data-request document (deprecated)"
description: "The deprecated Sanity document type that recorded one GDPR data-subject request."
status: stable
---

# Data-request document (deprecated)

> A read-only legal record of one visitor exercising a GDPR right.

## Purpose

Defines the `dataRequest` Sanity document — one record per data-subject request sent through the public data-request form (access, erasure, portability, and the other rights). Fields are captured server-side by `submitDataRequest`; the editor only works the `status`. This type is deprecated: new requests are stored in the app's D1 database and read from the admin screen. It stays read-only for the requests still open at the switch and is removed once none remain.

## Exports

- `default` — the `dataRequest` `SchemaTypeDefinition` (a Sanity document). It is not internationalised; the captured fields are read-only, only `status` is editable.

## Usage

```ts
import dataRequest from "@indiecrafts/packages-web-compliance/sanity/data-request";

// Registered in the compliance SanityModule schemaTypes.
schemaTypes: [dataRequest];
```

## Source

`code/packages/web/compliance/src/sanity/data-request.ts`
