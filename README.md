# indiecrafts.dev — platform

Config-first Next.js 16 template, structured as a **full-platform monorepo** with the
dev framework in-repo. **Four root folders that mirror each other** — same
`apps/web · modules · packages · db · infra` spine:

- **`code/`** — EXECUTION: the pnpm + Turborepo workspace (the product). `apps/web` is the
  Next.js app (`@indiecrafts/web`); `packages/ modules/ db/ infra/` are slots for growth.
- **`method/`** — HOW we work: the `claude-tasks` dev framework, foldered like the code —
  `shared/` (7-phase `process/`, the `engineering/` brain, `templates/`), `apps/web/`,
  `modules/ packages/ db/ infra/`. Browsable as its own docs site.
- **[`work/`](./work/)** — DOING: the lab. Per-app/feature sprints (`00_BRIEF…09_OUTPUTS`), plus
  `MEMORY`, `backlog`, `archive`, `scratch` (gitignored). Browsable as its own site (`pnpm work`).
- **`docs/`** — CANON: the product documentation site (VitePress), foldered like the code —
  `shared/`, `apps/web/`, `modules/ packages/ db/ infra/`.

Flow: think in `work/` → build in `code/` → promote what sticks to `docs/`.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · next-intl v4 ·
next-themes · shadcn/ui · Sanity. Workspace: pnpm + Turborepo.

The web app has its own briefs: **how to code** → [`code/apps/web/CLAUDE.md`](./code/apps/web/CLAUDE.md) ·
**how to design** → [`code/packages/tokens/DESIGN.md`](./code/packages/tokens/DESIGN.md) ·
**app README** → [`code/apps/web/README.md`](./code/apps/web/README.md) · **framework** → [`method/`](./method/).

## Getting started

Run everything from the **repo root** — scripts delegate to the app (`@indiecrafts/web`) via Turborepo. The app lives at `code/apps/web`.

```bash
pnpm install            # installs the whole workspace (all of code/)
pnpm dev                # http://localhost:3000  (turbo → @indiecrafts/web)
pnpm build              # production build → code/apps/web/.next
pnpm verify             # tsc + lint + format:check + contrast + react-doctor (CI gate)
pnpm verify:quick       # tsc + lint (manual pre-PR check)
```

## Deploy — not locked to one host

The workspace installs at the **repo root**; the app builds to `code/apps/web/.next`.

- **Netlify** — per-app manifest `code/apps/web/netlify.toml` (`command = pnpm build`, `publish = code/apps/web/.next`); in the Netlify UI set **Package directory = `code/apps/web`** and leave **Base directory unset** so pnpm installs the workspace from root. First-deploy steps → [`code/apps/web/README.md`](./code/apps/web/README.md) § Deployment.
- **Vercel / Cloudflare / anywhere** — point the project at this repo, keep **install at the repo root**, set build `pnpm build` and Root Directory / output to `code/apps/web`. Each `apps/*` you add later is its own deploy target.

## Documentation — two VitePress sites

Each is its own npm package, isolated from the pnpm workspace:

```bash
pnpm docs:install   # once           pnpm method:install # once
pnpm docs           # → :3002        pnpm method         # → :3003
pnpm docs:build                      pnpm method:build
```

- **Product docs** ([`docs/`](./docs/)) — how the template works: setup, config, design, SEO, blog, client-intake. Mirrors the code spine.
- **Method / framework** ([`method/`](./method/)) — how we work: the 7-phase sprint, the engineering brain, rules, workflows.

The app's own how-to (adding a page/section, i18n, SEO, forms, cookie/legal, critical rules) lives in [`code/apps/web/README.md`](./code/apps/web/README.md).
