# @indiecrafts/admin — internal admin dashboard

Auto-loads under `code/apps/admin/**`. An **internal, auth-gated Next app** (App Router → OpenNext → Cloudflare Worker) — a read/write lens over the shared tenant dataset for staff. Same shell as `web`; internal, so no public SEO/i18n. Platform rules live in the root `CLAUDE.md`.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · OpenNext → Cloudflare Workers. **Scaffold — not production-ready.**

## Fill it in

- **Auth first.** Put it on a private subdomain behind **Cloudflare Access** (or your IdP) + a server session guard — never ship an ungated admin.
- Copy the `next.config.ts` security preset from `code/apps/web`; build the UI from `@indiecrafts/ui` primitives.
- Writes go through `@indiecrafts/sanity/write` (the Editor-token write client) — hard-code `_type`, whitelist fields.

## Deploy

`pnpm deploy:admin:<dev|staging|prod>` (OpenNext build → `wrangler deploy`) or `pnpm deploy:all:<env>`. `pnpm project:rename <slug>` renames the Worker stem; the guard blocks staging/prod until renamed.

## Pointers

- Multi-app model → [`docs/shared/architecture/multi-app.md`](../../../../docs/shared/architecture/multi-app.md); reference app → `code/apps/web`.
