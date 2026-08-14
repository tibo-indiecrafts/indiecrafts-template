# Cloudflare as code (domain · security · cache)

Terraform provisions the Cloudflare **edge** — the parts `wrangler.toml` can't express (WAF and
rate-limit rules, cache rules, bot mode). Clean split:

- **`wrangler`** deploys the **Worker** (`deploy:web:<env>`).
- **Terraform** owns the **edge**: auto custom domain · WAF · rate-limit · Bot Fight Mode · cache
  rules · Tiered Cache · zone hardening · the Turnstile widget.

Lives in `code/infra/iac/cloudflare/` — a reusable **module** (`modules/site/`) invoked **per app**
(`apps/<app>/`) with **per-env** tfvars. Written for the `cloudflare/cloudflare ~> 5` provider.

## Per app × per env

State is isolated **per env** in a Terraform **workspace**; values come from `env/<env>.tfvars`.
The delegators mirror the deploy scripts (`deploy:web:<env>` → `infra:web:<action>:<env>`):

```bash
export CLOUDFLARE_API_TOKEN=…        # scoped — see Prerequisites

pnpm infra:web:init                  # one-time: terraform init
pnpm infra:web:plan:prod             # review the diff (does nothing)
pnpm infra:web:apply:prod            # provision prod
pnpm infra:web:apply:staging         # …and staging (separate state)
pnpm infra:web:output:prod           # read the Turnstile keys (below)
```

`init | plan | apply | destroy | output` × `dev | staging | prod`. Under the hood:
`node scripts/infra.mjs <app> <action> <env>` → `-chdir` into the app dir, `terraform workspace
select <env>`, `-var-file=env/<env>.tfvars`.

## Prerequisites

- **Terraform ≥ 1.6** (`brew install terraform`).
- **`CLOUDFLARE_API_TOKEN`** — a **scoped** token (dashboard → My Profile → API Tokens):
  _Zone_ → DNS · Cache Rules · Config · WAF · Zone Settings **Edit**; _Account_ → Workers Scripts ·
  Turnstile **Edit**. Never commit it.
- Fill `apps/web/env/<env>.tfvars` — `account_id`, `zone_id` (the domain's zone), and `domain`.
  `project:rename <slug>` rewrites `worker_name` to match the wrangler names.

## What it provisions (`modules/site/main.tf`)

| Resource | Effect |
| --- | --- |
| `cloudflare_workers_custom_domain` | **auto domain** — attaches `<domain>` to the env's Worker; CF makes the DNS record + cert |
| `cloudflare_ruleset` (http_ratelimit) | **rate-limit on `/api/*`** — the `@indiecrafts/security` `withGuard` **primary** limiter |
| `cloudflare_ruleset` (firewall_managed) | Cloudflare **Managed WAF** ruleset |
| `cloudflare_bot_management` `fight_mode` | **Bot Fight Mode** (free). Note: separate pipeline — no skip/exceptions (upgrade to Super Bot Fight Mode on Pro for skip rules) |
| `cloudflare_ruleset` (cache_settings) | **Cache Rules** — immutable `/_next/static`, **bypass** `/api` + `/studio` |
| `cloudflare_tiered_cache` | **Tiered Cache** — funnel misses through one upper-tier PoP |
| `cloudflare_zone_setting` ×3 | SSL **strict** · min TLS **1.2** · Always-Use-HTTPS |
| `cloudflare_turnstile_widget` | provisions the widget → outputs the keys (below) |

Toggle any off per env via the `enable_*` variables in the tfvars.

## Turnstile keys → the app

The widget's keys are Terraform **outputs**. After `apply`:

```bash
pnpm infra:web:output:prod
# turnstile_site_key = "0x4AAA…"   → NEXT_PUBLIC_TURNSTILE_SITE_KEY (public)
# turnstile_secret   = <sensitive> → TURNSTILE_SECRET (server)
```

Put the **site key** in the app env (public) and the **secret** via `secrets:sync:web:prod` (never
commit it). Until they're set, the form guard runs on honeypot + origin + rate-limit + body-cap;
Turnstile just no-ops. See [Security headers](./security-headers.md) + `@indiecrafts/security`.

## Caching, end to end

- **App (Worker):** OpenNext caches ISR in R2 (`NEXT_INC_CACHE_R2_BUCKET`); its KV cache rides
  Tiered Cache. This layer adds the **edge** cache in front.
- **Edge (here):** immutable `/_next/static` cached a year; `/api` + `/studio` + draft mode never
  cached; Tiered Cache reduces origin hits. Cache Reserve (persistent) is a one-line add if needed.

## Add app #2

Copy `apps/web/` → `apps/<app>/`, point the tfvars at that app's Worker names + domain, and add
`infra:<app>:<action>:<env>` delegators (mirroring `infra:web:*`). The module is shared.

## State

Local per-workspace state (`terraform.tfstate.d/<env>/`, gitignored — it holds the Turnstile
secret). For a team, switch to **remote state** (Cloudflare **R2** via the Terraform `s3` backend,
or Terraform Cloud) — add a `backend` block to `apps/web/main.tf`. Commit `.tf`, `.tfvars`
(placeholders), and `.terraform.lock.hcl`; never state.

## Verify

`pnpm infra:web:init` then `plan` — Terraform validates the schema against the pinned provider (run
`terraform -chdir=… validate` too; provider schemas evolve — adjust any renamed argument). A green
`plan` shows exactly what will change before `apply`.
