# @indiecrafts/marketing

A second **Next app** (App Router → OpenNext → Cloudflare Worker), a read-lens over
the shared tenant Sanity dataset. **Scaffold** — the deploy shell + a bare app; copy
the production patterns it needs from `code/apps/web` (security headers, image loader,
i18n, theme). It ships its **own** `src/config` (look + feature set), shares content.

```bash
pnpm --filter @indiecrafts/marketing dev        # next dev
pnpm deploy:marketing:prod                       # OpenNext build → wrangler deploy
pnpm deploy:all:prod                             # every app, ordered
```

Not verified yet — run `pnpm install` then `pnpm --filter @indiecrafts/marketing tsc`.
Multi-app model: [docs/shared/architecture/multi-app.md](../../../docs/shared/architecture/multi-app.md).
