---
title: "Clerk emails singleton"
description: "The Sanity singleton holding editable, translated copy for every Clerk authentication and security email."
status: stable
---

# Clerk emails singleton

> Editable, per-language copy for every Clerk auth and security email the API worker takes over.

## Purpose

Defines the `clerkEmails` Sanity singleton — the editable copy for every Clerk authentication and security email the API worker takes over. It is a separate document from the main "E-mails" singleton so the auth and security set lives on its own. Each group's copy is translated per language and resolved to the recipient's stored locale; every field is optional and falls back, per field, to the copy hardcoded in the worker, so an email never breaks when Sanity is unset. The OTP code, magic-link URL, and device details are inserted by the worker; only the surrounding copy is editable.

## Exports

- `buildClerkEmails()` — build the `clerkEmails` `SchemaTypeDefinition` (a Sanity document) with all Clerk email groups plus the post-signup welcome.
- `clerkEmailsStructureItem(S)` — the "E-mails Clerk" desk editor for the singleton.

## Usage

```ts
import {
  buildClerkEmails,
  clerkEmailsStructureItem,
} from "@indiecrafts/packages-web-email/sanity";

schemaTypes: [buildClerkEmails()];
structure: (S) => [clerkEmailsStructureItem(S)];
```

## Source

`code/packages/web/email/src/sanity/clerk-emails.ts`
