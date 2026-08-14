# @indiecrafts/marketing — marketing Next app

Auto-loads under `code/apps/marketing/**`. A second **Next app** (App Router) deployed to Cloudflare Workers via **OpenNext** — same shell as `web`, a read-lens over the shared tenant dataset. This file is the app's _how to code_; platform rules live in the root `CLAUDE.md`.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · OpenNext → Cloudflare Workers · wrangler 4. **Scaffold — not production-ready yet.**

## Fill it in (copy from `web`, don't re-derive)

- `next.config.ts` — add the security-headers preset (`@indiecrafts/security`), the Sanity `images.loaderFile`, and CSP from `code/apps/web/next.config.ts`.
- `src/app/[locale]/layout.tsx` — fonts, theme provider, next-intl, JSON-LD/metadata chain.
- `src/config/` — this app's own `theme`/`fonts`/`features`/`pages` (app-owned; import via `@/config`). It shares content (Sanity) with `web` but ships its own look + feature set.

## Deploy

`pnpm deploy:marketing:<dev|staging|prod>` (OpenNext build → `wrangler deploy`) or `pnpm deploy:all:<env>`. `pnpm project:rename <slug>` renames its Worker/R2 stem; the shared-account guard blocks staging/prod until renamed.

## Pointers

- Multi-app model → [`docs/shared/architecture/multi-app.md`](../../../../docs/shared/architecture/multi-app.md).
- The reference app → `code/apps/web` (copy its patterns). Log changes in this app's `CHANGELOG.md`.
