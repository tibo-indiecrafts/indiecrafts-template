# code/infra — envs · iac · ci

Auto-loads when you work under `code/infra/**`. Environments (`envs/`), infrastructure-as-code
(`iac/`), CI (`ci/`). Stubs today (`.gitkeep`). **How we run ops** →
`method/infra/infrastructure-and-ops.md` + `method/infra/observability.md`. **What it is** →
`docs/infra/`.

## Rules

- **Secrets never land in git** — only `.env.example` is committed; real values live in the host's env store (Netlify → Site settings). Never a token under `NEXT_PUBLIC_`.
- **dev · staging · prod parity** — the three envs differ only in values, not shape; `NEXT_PUBLIC_SITE_URL` unset → `robots.ts` serves `Disallow: /` (the staging gate).
- **Deploy = the workspace, installed at repo root.** Each app owns its **per-app deploy manifest** in its own package dir (`code/apps/web/netlify.toml`) — Netlify reads it there (Package directory = the app, Base = unset so install runs from root). This folder holds **shared, cross-app** infra (DNS · multi-env · IaC · CI helpers), not the per-app manifest. Not locked to Netlify — any host that installs at root works.
- IaC is **declarative + reviewed**; no click-ops changes that aren't reflected in `iac/`.
- Log infra changes in this area's own `CHANGELOG.md`; roll up to root at release.
