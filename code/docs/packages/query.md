# Query (`@indiecrafts/packages-shared-query`)

The shared **TanStack Query** setup for the **client SPAs** — mobile (Expo). Holds the shared _config_
and the _key convention_; each app owns its `QueryClient` +
`<QueryClientProvider>`. Lives in `code/packages/shared/query`.

## Not the web

The **website does NOT use this.** It is Next App Router + **RSC**: server data is fetched in Server
Components (`cache()` / `sanityFetchLive`), server-rendered, mostly static. TanStack Query is a _client_
state manager — using it there forces `"use client"` + client fetching and throws RSC away. The client
apps have no server render, so they own their server-state cache with TanStack; the web keeps RSC.

## What it exports (React-free, zero-dep)

```ts
export const queryDefaults; // { queries: { staleTime, gcTime, retry, refetchOnWindowFocus:false } }
export const queryKeys = {
  all: ["indiecrafts"],
  list: (domain) => ["indiecrafts", domain], // a collection
  detail: (domain, id) => ["indiecrafts", domain, id], // one entity
};
```

- **`queryDefaults`** — one `QueryClient` config for every client app (brief freshness; no focus refetch —
  a native app has no browser-tab focus; a couple of retries for flaky mobile networks).
- **`queryKeys`** — the ONE home for query keys (the cache equivalent of `STORAGE_KEYS`); every key is
  namespaced under one root, so `invalidateQueries({ queryKey: queryKeys.all })` clears everything. Add
  domain helpers as screens land.

The brick is **React-free on purpose**: it ships no React, so mobile (React 18) does
`new QueryClient({ defaultOptions: queryDefaults })` from its own
`@tanstack/react-query` and renders its own provider.

## Wiring (per client app)

Two wires: a `workspace:*` dep on the brick + `@tanstack/react-query` in the app; then a provider at the
root. Mobile — `app/_layout.tsx` wraps the tree in `<QueryClientProvider>`.

```tsx
const queryClient = new QueryClient({ defaultOptions: queryDefaults });
<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
```

## The `queryFn` is the api-client

- **Mobile** — `useQuery({ queryKey: queryKeys.list("posts"), queryFn: () => fetchPosts() })`, the
  `queryFn` calling the mobile api-client (a typed `fetch` of the `code/shared/api` Worker, bearer-authed).
- A **write** is an action, not cached server-state → `useMutation`, not `useQuery`.

## Not yet (deferred — no consumer)

- **No hooks.** The provider + config are the foundation; `useQuery`/`useMutation` hooks land with the
  first real data screen (documented pattern above), not before.
- **No offline persister.** `@tanstack/react-query-persist-client` (AsyncStorage / localStorage) persists
  the query cache across restarts — but there is nothing cached until the first query exists. It layers on
  with that first `useQuery`, alongside the offline-status work.
