---
title: "Compliance email groups"
description: "The compliance surface's transactional-email groups contributed to the shared emailStrings singleton."
status: stable
---

# Compliance email groups

> The GDPR alert and the two erasure emails, defined as emailStrings groups.

## Purpose

Defines the compliance surface's transactional-email groups on the shared `emailStrings` singleton. It contributes three groups: `dataRequestOwner` (the team alert on a new GDPR data-subject request), and `erasureToken` / `erasureComplete` (the api worker's two account-erasure emails). The erasure emails have no locale signal, so only the default-locale copy is used and empty fields fall back to the worker's built-in English copy.

## Exports

- `emailGroups` — an array of email-group field definitions. Contributed via `complianceSanity.emailGroups` and composed into the `emailStrings` document by `emailSanity(modules)`.

## Usage

```ts
import { emailGroups } from "@indiecrafts/packages-web-compliance/sanity/email";

export const complianceSanity = {
  // ...
  emailGroups,
};
```

## Source

`code/packages/web/compliance/src/sanity/email.ts`
