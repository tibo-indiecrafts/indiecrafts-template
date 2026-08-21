# web · infra — co-located Cloudflare edge (Terraform)

Auto-loads under `code/projects/web/surfaces/website/infra/**`. The `web` app's **per-app Terraform root** — it owns the
Cloudflare **edge** (domain · WAF · rate-limit `/api/*` · cache · Turnstile) that `wrangler.toml` can't
express. The app owns its whole deploy surface: `wrangler.toml` ships the Worker, this ships the edge.

**Stack:** Terraform (`cloudflare/cloudflare ~> 5`). **Self-contained** — one `main.tf` holds the provider,
the per-app/per-env variables, and all the edge resources directly (no shared module). To add IaC to
another app, **copy this whole dir** to `code/projects/<app>/infra` and retarget the tfvars.

## Files

- `main.tf` — provider + variables + the edge resources (custom domain · rate-limit · WAF · Bot Fight ·
  cache rules · Tiered Cache · zone hardening · Turnstile) + outputs (Turnstile keys + domain). The edge
  tunables (`rate_limit_*`, `enable_managed_waf`/`bot_fight`/`cache_rules`/`tiered_cache`) are active
  variables with sensible defaults — override a value in the tfvars. **Commented** optionals in the file: a
  remote-state backend, a first-party asset-CDN domain (`cdn.<domain>`), and CF Image Transformations.
- `env/{dev,staging,prod}.tfvars` — the per-env **values** (`account_id`, `zone_id`, `domain`,
  `worker_name`, `turnstile_domains`). `dev` runs on `*.workers.dev` (`attach_domain = false`).

## Run (from the repo root)

```bash
pnpm infra:website:init            # once
pnpm infra:website:plan:<env>      # review the diff
pnpm infra:website:apply:<env>     # provision
pnpm infra:website:output:prod     # read outputs (Turnstile keys)
```

Needs a **scoped** `CLOUDFLARE_API_TOKEN` (Zone: DNS/Cache/WAF edit · Account: Workers/Turnstile edit).
`shared/scripts/infra/run.mjs` selects a Terraform **workspace per env** (state isolated per env).

## Rules

- **NEVER commit state** — `terraform.tfstate*` holds the Turnstile secret + resource ids (gitignored here).
- **Turnstile keys flow to the app env** — `output turnstile_site_key` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
  `turnstile_secret` → `TURNSTILE_SECRET` (set via `pnpm secrets:sync:website:*`, never committed).
- **`pnpm project:rename <slug>`** rewrites `worker_name` in these tfvars (matches the wrangler names) —
  don't hand-edit the stem.
- **Validate before first apply** — `terraform init && validate` against the pinned provider; CF provider
  resource schemas rename arguments between versions. It has never been applied (tfvars are placeholders).
- Full runbook (token scopes, remote state, domain) → `code/docs/infra/cloudflare-iac.md`. Deploy model →
  `code/docs/shared/architecture/platform-deploy.md`.
