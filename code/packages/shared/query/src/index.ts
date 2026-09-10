/**
 * @indiecrafts/packages-shared-query — the shared TanStack Query setup for the
 * CLIENT SPAs (mobile Expo). The **web** app does NOT use
 * this: it is Next App Router + RSC, where server data is fetched in Server Components
 * (`cache()` / `sanityFetchLive`) — TanStack is a client state manager and would throw
 * RSC away. Client apps have no server render, so they own their server-state here.
 *
 * This brick is **React-free + zero-dep** on purpose: it holds only the shared *config*
 * (`queryDefaults`) and the *key convention* (`queryKeys`). Each app creates its own
 * `QueryClient` and renders its own `<QueryClientProvider>` from its own
 * `@tanstack/react-query` — so the native surfaces never share a
 * React or a client instance. Extracted now because BOTH platforms adopt it (the
 * ≥2-consumer rule); it grows shared hooks when a real data screen lands.
 *
 * The `queryFn` is the api-client: `useQuery({ queryKey: queryKeys.list("posts"),
 * queryFn: () => fetchPosts(...) })` on the native/web surfaces. A mutating action uses
 * `useMutation`, not a cached query.
 */

/**
 * Default `QueryClient` options, shared by every client app. Passed to
 * `new QueryClient({ defaultOptions: queryDefaults })`. Tuned for a mobile/desktop
 * client reading a mostly-static content API: brief freshness, no focus refetch
 * (native apps have no "window focus" the way a browser tab does), a couple retries.
 */
export const queryDefaults = {
  queries: {
    staleTime: 30_000, // 30s — a fetched list stays "fresh" briefly before a refetch
    gcTime: 5 * 60_000, // keep an unused cache entry 5 min before garbage-collecting
    retry: 2, // a flaky mobile network gets two more tries before failing
    refetchOnWindowFocus: false, // not a browser tab; refetch on reconnect/mount instead
  },
};

const ROOT = "indiecrafts";

/**
 * The ONE home for query keys — no scattered `["posts", id]` arrays across screens
 * (the query-cache equivalent of `STORAGE_KEYS`). Every key is namespaced under one
 * root, so a broad `invalidateQueries({ queryKey: queryKeys.all })` clears everything.
 * Add domain helpers as screens land; `list`/`detail` cover the common shapes.
 */
export const queryKeys = {
  /** The root prefix — invalidate this to clear the whole app cache. */
  all: [ROOT] as const,
  /** A collection: `queryKeys.list("posts")` → `["indiecrafts", "posts"]`. */
  list: (domain: string) => [ROOT, domain] as const,
  /** One entity: `queryKeys.detail("posts", id)` → `["indiecrafts", "posts", id]`. */
  detail: (domain: string, id: string) => [ROOT, domain, id] as const,
};
