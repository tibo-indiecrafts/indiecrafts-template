---
title: "Orders erasure adapter (stub)"
description: "A registered no-op erasure adapter reserving the orders store ahead of a real commerce backend."
status: stable
---

# Orders erasure adapter (stub)

> A no-op placeholder so the engine can enumerate "orders" before the store exists.

## Purpose

A future commerce seam. Orders and invoices carry a 7–10 year anonymised retention duty, and the real adapter lands with the product D1 and checkout. No orders store exists yet, so this is a registered no-op stub: every method returns empty `anonymized`/`deleted` maps. It lets the engine and receipt already list `orders` ahead of the real store.

## Exports

- `createOrdersErasureAdapter()` — returns the no-op `ErasureAdapter` named `orders`.

## Usage

```ts
import { createOrdersErasureAdapter } from "@indiecrafts/api/erasure/orders";

const adapter = createOrdersErasureAdapter();
```

## Source

`code/shared/api/src/erasure/orders.ts`
