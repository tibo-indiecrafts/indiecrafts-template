---
title: "Email strings singleton builder"
description: "Builds the emailStrings Sanity singleton where every transactional email is configured."
status: stable
---

# Email strings singleton builder

> The one place every transactional email's recipients, sender, and copy are configured.

## Purpose

Builds the `emailStrings` Sanity singleton — the one place every transactional email is configured: who receives it, the sender, and the copy. Subscriber-facing copy is translated per language; internal alerts keep a plain subject. The document is field-less on its own — each email group is contributed by its owning module and composed in by `emailSanity(modules)`. It always carries the global `supportEmail` and QA `bccAll` fields. Read at runtime via `getEmailStrings()`.

## Exports

- `buildEmailStrings(groups)` — build the `emailStrings` `SchemaTypeDefinition` (a Sanity document) from the passed module email groups, prepended with the global support and BCC fields.

## Usage

```ts
import { buildEmailStrings } from "@indiecrafts/packages-web-email/sanity";

const groups = modules.flatMap((m) => m.emailGroups ?? []);
schemaTypes: [buildEmailStrings(groups)];
```

## Source

`code/packages/web/email/src/sanity/email-strings.ts`
