---
title: "Contact message schema"
description: "Sanity document type for a contact submission — read-only except its status field."
status: stable
---

# Contact message schema

> The inbox record captured from the public contact form; every field is read-only except `status`.

## Purpose

This schema defines the `contactMessage` document — captured by the `module.contact` block via `/api/contact` (the server-only write client). The public form fills every field, so they are all read-only in Studio except `status` (the one thing an editor changes as they work the inbox). Unlike the waitlist there is no dedupe: each submission is its own record. Fields include `email`, `name`, `subject`, `message`, `status` (`new` / `handled`), `source`, `language`, `consent`, `consentPolicyVersion`, and `createdAt`.

## Exports

- default — the `contactMessage` document type definition (`defineType`).

## Usage

```ts
import contactMessage from "@indiecrafts/modules-web-contact/sanity/schema/contact-message";

export const schemaTypes = [contactMessage];
```

## Source

`code/modules/web/contact/src/sanity/schema/contact-message.ts`
