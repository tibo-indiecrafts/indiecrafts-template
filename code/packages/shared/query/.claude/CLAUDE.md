# @indiecrafts/packages-shared-query — TanStack Query setup

Auto-loads under `code/packages/shared/query/**`. The shared TanStack Query config + key convention
for the **client SPAs** — mobile (Expo) and the hybrid (Electron) renderer. Holds the shared config
and the query-key home; each app owns its own `QueryClient` + `<QueryClientProvider>`. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, React-free, zero-dep — a config object + key helpers; the app supplies `@tanstack/react-query`.

- **Exports:** `.` — `queryDefaults` (one `QueryClient` config) + `queryKeys` (namespaced key factory).
- **NOT the website** — the web app is Next App Router + RSC; TanStack is client state and would throw RSC away. Only the client SPAs use this.
- **React-free on purpose** — mobile (React 18) and hybrid (React 19) never share a React; each `new QueryClient({ defaultOptions: queryDefaults })` from its own copy.
- **The agent is an action, not cached server-state** → `useMutation`, not `useQuery`. No hooks / no offline persister yet (land with the first data screen).

Full reference → [`code/docs/packages/query.md`](../../../../docs/packages/query.md).
