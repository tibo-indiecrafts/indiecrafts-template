---
title: "Native consent store"
description: "An AsyncStorage-backed Store adapter with a synchronous in-memory mirror."
status: stable
---

# Native consent store

> The AsyncStorage-backed store adapter for the Expo shell.

## Purpose

Builds a `Store` adapter backed by `AsyncStorage`. AsyncStorage is async but the `Store.get()` contract is synchronous, so this keeps an in-memory mirror: it hydrates once at creation, serves `get()` from memory, and writes through on `save()`. It serves both the consent record and the legal-acceptance record, each under its own `storageKey`.

## Exports

- `createNativeStore<T>(storageKey)` — returns a `Store<T>` with `get`, `save`, and `subscribe`.

## Usage

```ts
import { createNativeStore } from "@indiecrafts/packages-shared-compliance/native";

const store = createNativeStore<ConsentRecord>("myapp.consent");
```

## Source

`code/packages/shared/compliance/src/native/store.ts`
