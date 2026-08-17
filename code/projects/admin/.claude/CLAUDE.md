# @indiecrafts/admin — internal admin dashboard (reserved slot · skeleton)

Auto-loads under `code/projects/admin/**`. A **separate, auth-gated Next.js app** for operators: moderation,
subscriber/waitlist ops, content review, dashboards over the shared Sanity dataset (+ Cloudflare D1 if
relational data lands). Not public — behind auth, `noindex`, its own subdomain.

**Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui — same stack as `web`.

**Activate:**
1. `pnpm create next-app@latest code/projects/admin`, name it `@indiecrafts/admin`.
2. Wire the shared bricks (`transpilePackages` + deps + tsconfig `paths` + `@source`); reuse
   `@indiecrafts/ui`/`ui-components` for the UI, `@indiecrafts/sanity` for reads, `@indiecrafts/security`
   for headers.
3. **Add auth** (the reserved `auth` brick — extract on ≥2 consumers). Gate every route.
4. Own `src/config` (app-instance); deploy to Cloudflare Workers/OpenNext behind auth.

**Rules:** compose from bricks; **no cross-app imports**; never expose a write token client-side. No UI
shipped yet — reserved slot with its plan.
