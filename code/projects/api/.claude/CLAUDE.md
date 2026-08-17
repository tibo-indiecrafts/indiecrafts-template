# @indiecrafts/api — standalone API (Cloudflare Worker · reserved slot · skeleton)

Auto-loads under `code/projects/api/**`. A **dedicated JSON/GraphQL API** for the non-web clients (`mobile`,
`hybrid`, partners). The web app keeps its own co-located `/api` routes; this is the shared, versioned
API those clients call — its own domain, its own deploy.

**Framework:** Cloudflare Workers · wrangler · **Hono** (router) · TypeScript. Same runtime as the
`workers` slot; add a router + CORS + auth.

**Activate:**
1. Mirror the `workers` slot's `package.json` + `wrangler.toml` (per-env, Workers Logs); add `hono`.
2. `src/index.ts` — a Hono app: `app.get("/v1/...")` reading Sanity via `@indiecrafts/sanity`, guarded by
   `@indiecrafts/security` (`withGuard`: origin/rate-limit/body-cap + a bearer/JWT check for clients).
   Version routes (`/v1`). CORS allowlist the mobile/hybrid origins.
3. Compose bricks: `@indiecrafts/config`, `@indiecrafts/logger` (add `@types/node` — see the `workers`
   brief on the isomorphic-types caveat), `@indiecrafts/security`, `@indiecrafts/sanity`,
   `@indiecrafts/schema` (typed GROQ results).
4. Deploy: `wrangler deploy --env <env>`; bind KV/D1/queues as needed.

**Rules:** compose bricks; **no cross-app imports**; auth every mutating route; never expose a write token.
Reserved slot with its plan.
