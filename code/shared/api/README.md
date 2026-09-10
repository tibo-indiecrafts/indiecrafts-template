# @indiecrafts/shared-api

Reserved slot for a **standalone JSON/GraphQL API** (Cloudflare Worker + Hono) serving the non-web clients
(`mobile`, partners). The web app keeps its own co-located `/api` routes; this is the shared,
versioned API on its own domain.

**Status: skeleton** — no app yet. Activate: mirror the `workers` slot's wrangler setup + add Hono, guard
routes with `@indiecrafts/packages-shared-security`, read Sanity via `@indiecrafts/packages-web-sanity`. See `.claude/CLAUDE.md`.
