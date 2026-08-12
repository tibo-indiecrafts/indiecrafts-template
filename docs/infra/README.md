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
  live in the host's env store (Netlify → Site settings).
- **Never a token under `NEXT_PUBLIC_`.** That prefix ships to the browser — a
  public var can never hold a secret.
- **dev · staging · prod parity.** Same variables everywhere; only the values
  change.
- **The staging gate:** `NEXT_PUBLIC_SITE_URL` unset → `robots.ts` serves
  `Disallow: /`, so a preview env can't get indexed.

## Deploy

The whole workspace installs at the **repo root**, so any host that installs at
root works. Netlify is the default — the **per-app manifest lives with the app**
(`code/apps/web/netlify.toml`), not here; infra holds the *shared* deploy topology
(DNS, envs, IaC, CI). Netlify config:

- Package directory = `code/apps/web` · Base directory = unset (install from root)
- `command = pnpm build`
- `publish = code/apps/web/.next`

Not locked to Netlify — swap the host, keep the root install. Each `apps/*` owns its
own manifest; shared resources are provisioned from `code/infra/`.

## Where it sits

Part of the four-folder mirror:

- **`code/infra/`** — build (the `envs/` · `iac/` · `ci/` slots)
- **`method/infra/`** — how (the ops playbook)
- **`docs/infra/`** — what (this page)

## Getting started

Read the ops playbook before touching an environment:

- [`method/infra/infrastructure-and-ops.md`](../../method/infra/infrastructure-and-ops.md)
  — config-as-data, secrets, flags-as-kill-switch, gates.
- [`method/infra/observability.md`](../../method/infra/observability.md) — error
  tracking, structured logs, metrics, canary.
- [`code/infra/CLAUDE.md`](../../code/infra/CLAUDE.md) — the per-slot agent
  conventions.
