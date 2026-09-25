---
title: "Error message extractor"
description: "Extracts a human-readable message from an unknown thrown value, including Zod-style errors."
status: stable
---

# Error message extractor

> Pulls a readable message out of any thrown value.

## Purpose

A dependency-free helper for turning an unknown caught value into a readable string. It handles a Zod-style error (an object with an `issues[]` array of `{ message }`) without importing `zod`, then a plain `Error`, then anything else via `String()`.

## Exports

- `getErrorMessage` — returns a human-readable message for any unknown thrown value.

## Usage

```ts
import { getErrorMessage } from "@indiecrafts/packages-shared-utils/error-message";

try {
  doWork();
} catch (error) {
  console.error(getErrorMessage(error));
}
```

## Source

`code/packages/shared/utils/src/error-message.ts`
