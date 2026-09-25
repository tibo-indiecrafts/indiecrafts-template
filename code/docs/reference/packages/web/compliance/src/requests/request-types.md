---
title: "Data-subject request types"
description: "The fixed list of data-subject rights shared by schema, validator, and email."
status: stable
---

# Data-subject request types

> One list of rights so the record, the validator, and the alert never drift.

## Purpose

The data-subject rights a visitor can exercise through the request form (GDPR Art. 15–21 plus consent withdrawal, Art. 7). The set is fixed by law, so this one list feeds the Sanity schema radio options, the submit validator's allowed set, and the owner-alert email labels. It is client-safe: no `server-only` and no Sanity import.

## Exports

- `DATA_REQUEST_TYPES` — the seven request-type keys (readonly tuple).
- `DataRequestType` — union type of one request-type key.
- `REQUEST_TYPE_LABELS_FR` — French labels for the Studio and the owner alert.
- `isDataRequestType(value)` — type guard for the allowed set.

## Usage

```ts
import {
  DATA_REQUEST_TYPES,
  isDataRequestType,
} from "@indiecrafts/packages-web-compliance/requests/request-types";

if (isDataRequestType(value)) {
  // value is a DataRequestType
}
```

## Source

`code/packages/web/compliance/src/requests/request-types.ts`
