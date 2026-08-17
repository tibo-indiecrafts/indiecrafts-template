# @indiecrafts/marketing — marketing site (reserved slot · skeleton)

Auto-loads under `code/projects/marketing/**`. A **separate Next.js site** for campaigns / landing pages /
microsites, kept apart from the main product app (`web`) so marketing ships fast without touching product
routes. Read-lens over the same Sanity dataset.

**Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 — same stack as `web`.

**Activate** (turn this slot into a real app):
1. `pnpm create next-app@latest code/projects/marketing` (or copy `web`'s shape), name it `@indiecrafts/marketing`.
2. Wire the shared bricks like `web`: `transpilePackages` + `workspace:*` deps + tsconfig `paths` (wildcard
   exports) + a `@source` line in `ui-tokens/globals.css` + its `SanityModule` group in a Studio (if it
   edits content — usually it's read-only).
3. Its **own** `src/config/{features,theme,fonts,pages}` (app-instance config; reuse `@indiecrafts/config`
   primitives) — see `docs/apps/web/config/multi-app.md`.
4. Deploy target: Cloudflare Workers/OpenNext (like `web`) **or** Vercel — own `wrangler.toml` / `vercel.json`.

**Rules:** compose from `code/packages/` bricks; **no cross-app imports**; run from the repo root
(`pnpm --filter @indiecrafts/marketing …`). No UI shipped yet — this is a reserved slot with its plan.
