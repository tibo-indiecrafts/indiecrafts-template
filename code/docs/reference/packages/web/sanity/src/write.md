---
title: "Sanity write client"
description: "The server-only authenticated Sanity client for runtime mutations."
status: stable
---

# Sanity write client

> The single authenticated write path into Sanity at runtime.

## Purpose

Creates the server-only, authenticated write client — the single write path at runtime (public comment submissions today). It uses the Editor-role `SANITY_API_WRITE_TOKEN`, which is now a runtime dependency, not just a seed token. `import "server-only"` throws if the module reaches a client bundle, and the token has no `NEXT_PUBLIC_` prefix. Sanity tokens are not per-type, so a caller must hard-code `_type` and whitelist fields, and never spread untrusted request input into a mutation. A document that holds personal data takes its `_id` from `privateId(type)` (`./private-id`): a random id is readable by anyone on a public dataset.

## Exports

- `writeClient` — the authenticated Sanity write client.

## Usage

```ts
import { privateId } from "@indiecrafts/packages-web-sanity/private-id";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";

await writeClient.create({ _id: privateId("comment"), _type: "comment", body });
```

## Source

`code/packages/web/sanity/src/write.ts`
