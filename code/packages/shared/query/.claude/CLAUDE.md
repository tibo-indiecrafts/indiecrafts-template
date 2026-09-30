# `@indiecrafts/packages-shared-query` — TanStack Query setup

Auto-loads under `code/packages/shared/query/**`. The shared TanStack Query config + key convention
for client-side SPAs. **No consumer today** — the Expo app it served is gone (the Capacitor shell
wraps the `app` surface); remove it or adopt it with the first TanStack screen. Holds the shared config
and the query-key home; each app owns its own `QueryClient` + `<QueryClientProvider>`. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, React-free, zero-dep — a config object + key helpers; the app supplies `@tanstack/react-query`.

- **Exports:** `.` — `queryDefaults` (one `QueryClient` config) + `queryKeys` (namespaced key factory).
- **NOT the website** — the web app is Next App Router + RSC; TanStack is client state and would throw RSC away. Only the client SPAs use this.
- **React-free on purpose** — the brick ships no React; a consumer creates `new QueryClient({ defaultOptions: queryDefaults })` with its own React copy.
- **No hooks / no offline persister yet** — land with the first data screen.

Full reference → [`code/docs/packages/query.md`](../../../../docs/packages/query.md).
