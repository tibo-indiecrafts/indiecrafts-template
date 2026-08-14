# @indiecrafts/admin

An **internal, auth-gated Next app** (App Router → OpenNext → Cloudflare Worker) for
staff — a read/write lens over the shared tenant dataset. **Scaffold**: the deploy
shell + a bare app. **Gate it behind auth (Cloudflare Access) before shipping.**

```bash
pnpm --filter @indiecrafts/admin dev        # next dev
pnpm deploy:admin:prod                       # OpenNext build → wrangler deploy
```

Not verified yet — run `pnpm install` then `pnpm --filter @indiecrafts/admin tsc`.
Copy production patterns (security headers, session guard, UI) from `code/apps/web`.
