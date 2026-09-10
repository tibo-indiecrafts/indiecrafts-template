# Apps — the deployable apps

**A Next app is a read-lens over one tenant's content** + its own Worker/domain. Today there is
one — `web` (`@indiecrafts/web-surfaces-website`) — but the platform is built so a second app (admin · standalone
blog · …) lands beside it without a rewrite. This page is _what the apps layer is_; each app's own
_how to build_ lives in its `CLAUDE.md`.

## What an app is

- **A read-lens over the tenant graph.** Content is one Sanity project/dataset per tenant; each app
  queries the slice it needs via the shared read client + generated types. One app holds the Studio
  (the hub); others are read-only. See [Multi-app architecture](/shared/architecture/multi-app).
- **Composed from bricks + modules, never coupled to a sibling app.** Deps point down —
  `app → module → package → db`. Apps share code only through `code/packages/` bricks, never by
  reaching into each other.
- **Its own instance config.** Design (`theme`/`fonts`), feature set (`features`), and routes
  (`pages`) are app-owned in `src/config` (imported via `@/config`); the shared
  [`@indiecrafts/packages-shared-config`](/packages/config) holds only primitives, so a second app ships its own look
  and feature set. See [Feature flags](/apps/web/config/feature-flags).
- **Its own Worker + domain.** One Cloudflare Worker per app × env (`<app>-<env>`), one zone per app.
  See [Cloudflare as code](/infra/cloudflare-iac).

## The apps

| App  | Package                             | Is                                                                                 | Deploy                      |
| ---- | ----------------------------------- | ---------------------------------------------------------------------------------- | --------------------------- |
| Web  | `@indiecrafts/web-surfaces-website` | the marketing site + Sanity-backed blog/page-builder (the hub Studio at `/studio`) | Next + OpenNext → CF Worker |
| API  | `@indiecrafts/shared-api`           | a bare Cloudflare Worker — HTTP API (deploy shell; logic from bricks)              | `wrangler deploy`           |
| Cron | `@indiecrafts/shared-cron`          | a bare Cloudflare Worker — scheduled tasks (`[triggers] crons`)                    | `wrangler deploy`           |

All ship with `pnpm deploy:<app>:<env>`; `pnpm deploy:all:<env>` deploys the fleet in order. Workers are apps — a deployable belongs in `code/projects/`, not a package (see below).

## Adding app #2

One app today; the platform is **multi-app-ready** (the config split + `composeStudio` landed —
[Multi-app architecture](/shared/architecture/multi-app)). When a second app is real:

1. **Code** — `code/projects/<name>/` with its own `CLAUDE.md` · `DESIGN.md` · `README.md`; add it to
   `pnpm-workspace.yaml` (already globs `code/projects/*`) + `code/projects/_registry.md`.
2. **Docs** — a sibling `docs/apps/<name>/` mirroring `web` (`setup/ config/ design/ seo/`), a row in
   the table above, and its sidebar group in `docs/.vitepress/config.mts`.
3. **Islands** — mount the shared modules it needs (blog, newsletter, …); each reads the app-injected
   config, so the same island recombines across apps.

The root `CLAUDE.md` stays the thin platform router; each app owns its brief.
