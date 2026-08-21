# @indiecrafts/web-surfaces-admin — internal admin dashboard (next-cf)

Auto-loads under `code/projects/web/surfaces/admin/**`. A **separate, auth-gated Next.js app** for operators: moderation,
subscriber/waitlist ops, content review, dashboards over the shared Sanity dataset (+ Cloudflare D1 if
relational data lands). Not public — behind auth, `noindex`, its own subdomain. **Activated scaffold — a real
Next app with placeholder pages; the real UI + the auth gate are still TBD.**

**Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui — same stack as `web`.
**Platform class:** `next-cf` (Next → OpenNext → Cloudflare Workers).

Shared bricks are wired (`transpilePackages` + deps + tsconfig `paths` + `@source`): reuse
`@indiecrafts/packages-web-ui`/`ui-components` for the UI, `@indiecrafts/packages-web-sanity` for reads, `@indiecrafts/packages-shared-security` for
headers. Ships its own `src/config` (app-instance).

- **Before shipping:** add auth (the reserved `auth` brick — extract on ≥2 consumers) + a Cloudflare Access
  gate on the subdomain; gate every route.
- **Deploy:** `pnpm deploy:admin:<dev|staging|prod>` → the shared `shared/scripts/deploy/next.mjs`; or
  `pnpm deploy:all:<env>`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../../../shared/scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../../../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose from bricks; **no cross-app imports**; never expose a write token client-side.
