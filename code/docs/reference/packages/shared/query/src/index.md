---
title: "Query defaults & keys"
description: "Shared TanStack Query config and the namespaced query-key factory for the client SPAs."
status: stable
---

# Query defaults & keys

> The React-free TanStack Query config and key convention the mobile SPA adopts.

## Purpose

The `@indiecrafts/packages-shared-query` entry point. It holds only the shared TanStack Query `defaultOptions` and the query-key factory. It is React-free and zero-dependency: each client app creates its own `QueryClient` and `QueryClientProvider`. The website does not use it, because it is Next App Router with RSC.

## Exports

- `queryDefaults` — default `QueryClient` options: 30s stale time, 5min GC, 2 retries, no window-focus refetch.
- `queryKeys` — namespaced key factory. `all` is the root prefix, `list(domain)` a collection key, `detail(domain, id)` a single-entity key.

## Usage

```ts
import { QueryClient } from "@tanstack/react-query";
import { queryDefaults, queryKeys } from "@indiecrafts/packages-shared-query";

const client = new QueryClient({ defaultOptions: queryDefaults });

useQuery({
  queryKey: queryKeys.list("posts"),
  queryFn: () => fetchPosts(),
});
```

## Source

`code/packages/shared/query/src/index.ts`
