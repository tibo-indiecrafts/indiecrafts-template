# @indiecrafts/packages-web-sanity — Sanity infra

Auto-loads under `code/packages/web/sanity/**`. Client/config plumbing: `client · live · env ·
token · structure · image · module · write`. Infra only. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** Sanity v6 · next-sanity · TypeScript. Shared CMS client + live + structure infra.

- **No `.` root export** — always import a subpath (`@indiecrafts/packages-web-sanity/env`, `.../client`).
- **`Studio.tsx` + the app's `sanity/structure.ts` stay in the app** — only reusable builders live here.
- Never `createClient` per route — import `./client`. Pin `sanity` to the app's major (v5).
- Full reference → [`code/docs/packages/sanity.md`](../../../../docs/packages/sanity.md).
