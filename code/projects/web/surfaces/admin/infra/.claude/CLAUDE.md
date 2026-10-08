# admin · infra — co-located Cloudflare edge (Terraform)

Auto-loads under `code/projects/web/surfaces/admin/infra/**`. The `admin` app's **per-app Terraform root** — it owns the
Cloudflare **edge** (domain · WAF · rate-limit `/api/*` · cache · Turnstile · **Zero Trust Access SSO gate**) that
`wrangler.toml` can't express. The app owns its whole deploy surface: `wrangler.toml` ships the Worker, this ships the edge.

**admin is SSO-gated.** This stack is the website stack PLUS an active Cloudflare Zero Trust Access gate on the
admin host — only the listed emails (`access_emails`) or email domain (`access_email_domain`) reach the Worker.
Set them in the tfvars (an attached host with both empty fails the plan), and configure Cloudflare Zero Trust (an IdP) on the account before the first apply.

**Stack:** Terraform (`cloudflare/cloudflare ~> 5`). **Self-contained** — one `main.tf` holds the provider,
the per-app/per-env variables, and all the edge resources directly (no shared module). A next-cf sibling of
the website stack (same resources) with the Access gate turned on.

## Files

- `main.tf` — provider + variables + the edge resources (custom domain · tiered rate-limit · WAF · Bot Fight ·
  custom firewall [sensitive-path block · opt-in bad-bot challenge · leaked-creds challenge] ·
  cache rules · Tiered Cache · zone hardening · Turnstile · **Zero Trust Access application + allow-policy**) +
  outputs (Turnstile keys + domain). The edge tunables (`rate_limit_*`,
  `enable_managed_waf`/`bot_fight`/`leaked_credentials`/`cache_rules`/`tiered_cache`, `block_bad_bots`) are active
  variables with sensible defaults — override a value in the tfvars. **Commented** optionals in the file: a
  remote-state backend, a first-party asset-CDN domain (`cdn.<domain>`), CF Image Transformations.
- `env/{dev,staging,prod}.tfvars` — the per-env **values** (`account_id`, `zone_id`, `domain`,
  `worker_name`, `turnstile_domains`, **`access_emails`** / `access_email_domain`). `dev` runs on `*.workers.dev`
  (`attach_domain = false`).

## Run (from the repo root)

```bash
pnpm infra:web:admin:init            # once
pnpm infra:web:admin:plan:<env>      # review the diff
pnpm infra:web:admin:apply:<env>     # provision
pnpm infra:web:admin:output:prod     # read outputs (Turnstile keys)
```

Needs a **scoped** `CLOUDFLARE_API_TOKEN` (Zone: DNS/Cache/WAF edit · Account: Workers/Turnstile/Access edit).
`shared/scripts/infra/run.mjs` selects a Terraform **workspace per env** (state isolated per env).

## Rules

- **admin is SSO-gated** — the Zero Trust Access gate is active; list the admins in `access_emails` (or set
  `access_email_domain`) in every attached-domain tfvars, and set up Cloudflare Zero Trust (an IdP) on the account first, or the apply fails.
- **NEVER commit state** — `terraform.tfstate*` holds the Turnstile secret + resource ids (gitignored here).
- **Turnstile keys flow to the app env** — `output turnstile_site_key` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
  `turnstile_secret` → `TURNSTILE_SECRET` (set via `wrangler secret put` / the app's secrets sync, never committed).
- **`pnpm project:rename <slug>`** rewrites `worker_name` in these tfvars (matches the wrangler names) —
  don't hand-edit the stem.
- **`pnpm check:infra` is the gate** (in `pnpm verify` + CI): `fmt` · `validate` (warnings fail) · a
  mock-provider `plan` per env, creds-free. Commit `.terraform.lock.hcl` (pins the provider + darwin/linux
  hashes; refresh with `terraform providers lock -platform=darwin_arm64 -platform=darwin_amd64 -platform=linux_amd64`).
- **One owner per zone** — zone-wide resources (entrypoint rulesets · bot management · tiered cache · TLS
  settings) sit behind `local.manage_zone` (`attach_domain && manage_zone`). The prod website owns the
  shared zone; staging and the subdomain stacks set `manage_zone = false` in their tfvars.
- Full runbook (token scopes, remote state, domain) → `code/docs/shared/infra/cloudflare-iac.md`. Deploy model →
  `code/docs/shared/architecture/platform-deploy.md`.
