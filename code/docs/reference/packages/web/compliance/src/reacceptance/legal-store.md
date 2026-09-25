---
title: "Legal acceptance cookie"
description: "First-party cookie recording the acknowledged legal version."
status: stable
---

# Legal acceptance cookie

> A real cookie the server can read, so the re-acceptance banner has no flash.

## Purpose

Records which legal version the visitor acknowledged in a small first-party cookie. Unlike cookie consent (which uses `localStorage`), this is a real cookie so the server can read it in the layout and decide whether to render the re-acceptance banner, with no client-side flash. It is framework-free and `typeof`-guarded, so the same module is safe to import from a server component (for the name) and a client component (for the writer).

## Exports

- `LEGAL_ACK_COOKIE` — the cookie name, namespaced by `site.prefix`.
- `acceptLegal(version)` — deposits the acknowledged version as a `SameSite=Lax`, 1-year cookie.

## Usage

```ts
import { acceptLegal } from "@indiecrafts/packages-web-compliance/reacceptance/legal-store";

acceptLegal(version);
```

## Source

`code/packages/web/compliance/src/reacceptance/legal-store.ts`
