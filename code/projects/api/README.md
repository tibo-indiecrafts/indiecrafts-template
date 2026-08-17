# @indiecrafts/api

Reserved slot for a **standalone JSON/GraphQL API** (Cloudflare Worker + Hono) serving the non-web clients
(`mobile`, `hybrid`, partners). The web app keeps its own co-located `/api` routes; this is the shared,
versioned API on its own domain.

**Status: skeleton** — no app yet. Activate: mirror the `workers` slot's wrangler setup + add Hono, guard
routes with `@indiecrafts/security`, read Sanity via `@indiecrafts/sanity`. See `.claude/CLAUDE.md`.
