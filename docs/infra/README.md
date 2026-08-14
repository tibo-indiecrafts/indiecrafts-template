# infra — environments · IaC · CI

How the site runs: the environments it deploys to, the infrastructure-as-code
that describes them, and the CI that gates each ship. The `code/infra/`
subfolders (`envs/`, `iac/`, `ci/`) are stubs today (`.gitkeep`) — this page is
the contract they'll grow into.

## What lives here

- **`envs/`** — `dev` · `staging` · `prod`. The three differ only in _values_,
  never in _shape_ (parity is the point).
- **`iac/`** — infrastructure-as-code: declarative, reviewed. No click-ops change
  that isn't reflected here.
- **`ci/`** — the pipeline that runs `pnpm verify` + `pnpm build` before a merge.

## Key conventions

- **Secrets never land in git.** Only `.env.example` is committed; real values
  live in the host's env store (Cloudflare Workers → Settings → Variables & Secrets,
  or `wrangler secret put`).
- **Never a token under `NEXT_PUBLIC_`.** That prefix ships to the browser — a
  public var can never hold a secret.
- **dev · staging · prod parity.** Same variables everywhere; only the values
  change.
- **The staging gate:** `NEXT_PUBLIC_SITE_URL` unset → `robots.ts` serves
  `Disallow: /`, so a preview env can't get indexed.

## Deploy

The whole workspace installs at the **repo root**, so any host that installs at
root works. The target is **Cloudflare Workers via OpenNext** — the **per-app
manifest lives with the app** (`code/apps/web/wrangler.toml`), not here; infra
holds the _shared_ deploy topology (DNS, zones, envs, IaC, CI). Per app:

- OpenNext (`@opennextjs/cloudflare`) builds the Next app into a Worker bundle.
- `wrangler.toml` names the Worker + its per-env bindings (R2, KV) — one Worker
  per app × env (`<app>-<env>`).
- Ship with `pnpm deploy:<app>:<env>` (→ `wrangler deploy`).

Not locked to Cloudflare — swap the host, keep the root install. Each `apps/*` owns
its own manifest; shared resources are provisioned from `code/infra/` (the Terraform
IaC — see [Cloudflare as code](/infra/cloudflare-iac)).

## Where it sits

- **`code/infra/`** — build (the `envs/` · `iac/` · `ci/` slots)
- **`docs/infra/`** — what (this page)

## Getting started

Before touching an environment:

- [`code/infra/CLAUDE.md`](../../code/infra/CLAUDE.md) — the per-slot agent
  conventions.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Cloudflare dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
