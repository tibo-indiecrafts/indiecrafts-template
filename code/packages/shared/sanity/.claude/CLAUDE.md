# @indiecrafts/sanity — Sanity infra

Auto-loads under `code/packages/shared/sanity/**`. Client/config plumbing: `client · live · env ·
token · structure · image`. Infra only. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** Sanity v5 · next-sanity · TypeScript. Shared CMS client + live + structure infra.

- **No `.` root export** — always import a subpath (`@indiecrafts/sanity/env`, `.../client`).
- **`Studio.tsx` + the app's `sanity/structure.ts` stay in the app** — only reusable builders live here.
- Never `createClient` per route — import `./client`. Pin `sanity` to the app's major (v5).
- Full reference → [`code/docs/packages/sanity.md`](../../../../docs/packages/sanity.md).
