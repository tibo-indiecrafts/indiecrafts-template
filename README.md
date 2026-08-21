# indiecrafts.dev — platform

Config-first Next.js 16 template, structured as a **full-platform monorepo**. The
deliverable is **two folders** that mirror each other's `apps/web · modules · packages ·
db · infra` spine:

- **`code/`** — EXECUTION: the pnpm + Turborepo workspace (the product). `apps/web` is the
  Next.js app (`@indiecrafts/web-surfaces-website`); `packages/ modules/ db/ infra/` are slots for growth.
- **`docs/`** — CANON: the product documentation site (VitePress), foldered like the code —
  `shared/`, `apps/web/`, `modules/ packages/ db/ infra/`.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · next-intl v4 ·
next-themes · shadcn/ui · Sanity. Workspace: pnpm + Turborepo.

The web app has its own briefs: **how to code** → [`code/projects/web/surfaces/website/CLAUDE.md`](./code/projects/web/surfaces/website/CLAUDE.md) ·
**how to design** → [`code/packages/tokens/DESIGN.md`](./code/packages/tokens/DESIGN.md) ·
**app README** → [`code/projects/web/surfaces/website/README.md`](./code/projects/web/surfaces/website/README.md).

## Getting started

Run everything from the **repo root** — scripts delegate to the app (`@indiecrafts/web-surfaces-website`) via Turborepo. The app lives at `code/projects/web/surfaces/website`.

```bash
pnpm install            # installs the whole workspace (all of code/)
pnpm dev                # http://localhost:3000  (turbo → @indiecrafts/web-surfaces-website)
pnpm build              # production build → code/projects/web/surfaces/website/.next
pnpm verify             # tsc + lint + format:check + contrast + react-doctor (CI gate)
pnpm verify:quick       # tsc + lint (manual pre-PR check)
```

## Deploy — Cloudflare Workers

The app deploys to **Cloudflare Workers** via OpenNext (`@opennextjs/cloudflare`) across **dev / staging / prod**, with an R2-backed ISR cache. GitHub Actions builds + deploys on push to `main`; run manually with `pnpm deploy:website:{dev,staging,prod}`. Per-app config: `code/projects/web/surfaces/website/wrangler.toml` + `open-next.config.ts`.

The workspace installs at the **repo root**; deploy scripts are app-namespaced, so each `apps/*` you add later is its own target (`deploy:<app>:<env>`). First-deploy steps (R2 buckets, secrets, custom domain, first-deploy checks) → [Deployment (Cloudflare)](./docs/apps/web/setup/deployment.md).

## Documentation

`docs/` is the product documentation site — its own npm package, isolated from the pnpm workspace:

```bash
pnpm docs:install   # once
pnpm docs           # → :3002
pnpm docs:build
```

- **Product docs** ([`docs/`](./docs/)) — how the template works: setup, config, design, SEO, blog, client-intake. Mirrors the code spine.

The app's own how-to (adding a page/section, i18n, SEO, forms, cookie/legal, critical rules) lives in [`code/projects/web/surfaces/website/README.md`](./code/projects/web/surfaces/website/README.md).

## Links

|                  | URL                                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| Live site        | `<https://your-domain.com>`                                              |
| Repo             | `<https://github.com/you/your-repo>`                                     |
| Deploy dashboard | `<Cloudflare Workers project URL>`                                       |
| Sanity Studio    | `<https://your-domain.com/studio>` — local: http://localhost:3000/studio |
| Product docs     | `<https://docs.your-domain.com>` — local: http://localhost:3002          |

<!-- Template placeholders — fill in per project. -->
