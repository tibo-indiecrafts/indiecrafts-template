---
title: "Sanity private id"
description: "Builds the dotted private.`<type>`.`<uuid>` id for a document that holds personal or operator data."
status: stable
---

# Sanity private id

> The id every runtime write of personal data uses, so a public dataset hides the document.

## Purpose

Sanity's free plan has public datasets only: anyone can read a document without a token, unless its id contains a dot. A random id from `client.create()` has no dot, so it is public. Every runtime write of personal data (a contact message, a waitlist entry, a comment) takes its `_id` from `privateId(type)` instead. Server reads use a token, so they still see the document.

## Exports

- `PRIVATE_PREFIX` — `"private."`, the id prefix that hides a document from anonymous reads.
- `privateId(type)` — returns a new id `private.<type>.<uuid>` (`crypto.randomUUID()`).

## Usage

```ts
import { privateId } from "@indiecrafts/packages-web-sanity/private-id";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";

await writeClient.create({
  _id: privateId("contactMessage"),
  _type: "contactMessage",
  email,
});
```

## Source

`code/packages/web/sanity/src/private-id.ts`
