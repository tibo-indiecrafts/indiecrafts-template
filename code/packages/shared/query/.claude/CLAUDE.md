# @indiecrafts/packages-shared-query — TanStack Query setup

Auto-loads under `code/packages/shared/query/**`. The shared TanStack Query config + key convention
for the **client SPAs** — mobile (Expo). Holds the shared config
and the query-key home; each app owns its own `QueryClient` + `<QueryClientProvider>`. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, React-free, zero-dep — a config object + key helpers; the app supplies `@tanstack/react-query`.

- **Exports:** `.` — `queryDefaults` (one `QueryClient` config) + `queryKeys` (namespaced key factory).
- **NOT the website** — the web app is Next App Router + RSC; TanStack is client state and would throw RSC away. Only the client SPAs use this.
- **React-free on purpose** — the brick ships no React, so mobile (React 18) creates `new QueryClient({ defaultOptions: queryDefaults })` from its own copy.
- **No hooks / no offline persister yet** — land with the first data screen.

Full reference → [`code/docs/packages/query.md`](../../../../docs/packages/query.md).
