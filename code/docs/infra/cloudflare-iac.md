# Cloudflare as code (domain · security · cache)

Terraform provisions the Cloudflare **edge** — the parts `wrangler.toml` can't express (WAF and
rate-limit rules, cache rules, bot mode). Clean split:

- **`wrangler`** deploys the **Worker** (`deploy:website:<env>`).
- **Terraform** owns the **edge**: auto custom domain · WAF · rate-limit · Bot Fight Mode · cache
  rules · Tiered Cache · zone hardening · the Turnstile widget.

The Terraform is **co-located with each app and self-contained**: `code/projects/<platform>/<kind>/<app>/infra/` holds one
`main.tf` (provider + vars + all edge resources + outputs) + **per-env** tfvars — no shared module.
Written for the `cloudflare/cloudflare ~> 5` provider.

## Per app × per env

State is isolated **per env** in a Terraform **workspace**; values come from `env/<env>.tfvars`.
The delegators mirror the deploy scripts (`deploy:website:<env>` → `infra:website:<action>:<env>`):

```bash
export CLOUDFLARE_API_TOKEN=…        # scoped — see Prerequisites

pnpm infra:website:init                  # one-time: terraform init
pnpm infra:website:plan:prod             # review the diff (does nothing)
pnpm infra:website:apply:prod            # provision prod
pnpm infra:website:apply:staging         # …and staging (separate state)
pnpm infra:website:output:prod           # read the Turnstile keys (below)
```

`init | plan | apply | destroy | output` × `dev | staging | prod`. Under the hood:
`node code/shared/scripts/infra/run.mjs <app> <action> <env>` → `-chdir` into the app dir, `terraform workspace
select <env>`, `-var-file=env/<env>.tfvars`.

## Prerequisites

- **Terraform ≥ 1.6** (`brew install terraform`).
- **`CLOUDFLARE_API_TOKEN`** — a **scoped** token (dashboard → My Profile → API Tokens):
  _Zone_ → DNS · Cache Rules · Config · WAF · Zone Settings **Edit**; _Account_ → Workers Scripts ·
  Turnstile **Edit**. Never commit it.
- Fill `code/projects/web/surfaces/website/infra/env/<env>.tfvars` — `account_id`, `zone_id` (the domain's zone), and `domain`.
  `project:rename <slug>` rewrites `worker_name` to match the wrangler names.

## What it provisions (`code/projects/web/surfaces/website/infra/main.tf`)

| Resource                                 | Effect                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `cloudflare_workers_custom_domain`       | **auto domain** — attaches `<domain>` to the env's Worker; CF makes the DNS record + cert. **Authoritative** — do NOT also uncomment the `[[env.*.routes]]` block in `wrangler.toml` (both claim the hostname and fight); gate with `attach_domain` |
| `cloudflare_ruleset` (http_ratelimit)    | **rate-limit on `/api/*`** — the `@indiecrafts/security` `withGuard` **primary** limiter                                        |
| `cloudflare_ruleset` (firewall_managed)  | Cloudflare **Managed WAF** ruleset                                                                                              |
| `cloudflare_bot_management` `fight_mode` | **Bot Fight Mode** (free). Note: separate pipeline — no skip/exceptions (upgrade to Super Bot Fight Mode on Pro for skip rules) |
| `cloudflare_ruleset` (cache_settings)    | **Cache Rules** — immutable `/_next/static`, **bypass** `/api` + `/studio`                                                      |
| `cloudflare_tiered_cache`                | **Tiered Cache** — funnel misses through one upper-tier PoP                                                                     |
| `cloudflare_zone_setting` ×3             | SSL **strict** · min TLS **1.2** · Always-Use-HTTPS                                                                             |
| `cloudflare_turnstile_widget`            | provisions the widget → outputs the keys (below)                                                                                |

Toggle any off per env via the `enable_*` variables in the tfvars.

**Commented optionals in `main.tf`** (uncomment + fill to activate — configure a maximum at the edge):

| Resource                                    | For                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `cloudflare_workers_custom_domain` (cdn)    | a first-party asset CDN on `cdn.<domain>` (`assetPrefix`)                                         |
| `cloudflare_zone_setting` (image_resizing)  | CF Image Transformations for first-party images                                                  |
| `cloudflare_zero_trust_access_application` + `_policy` | **gate the admin app behind SSO** — copy into admin's own `infra/cloudflare` when it ships |
| `cloudflare_ruleset` (dynamic_redirect)     | www → apex (single redirect at the edge)                                                          |
| `cloudflare_dns_record`                     | extra records (SPF/TXT/verification) when CF isn't already fronting the apex                      |
| `cloudflare_logpush_job`                    | ship HTTP/Worker logs to R2/SIEM (retention / compliance)                                         |

The Worker's own bindings (KV · R2 · D1 · queues · services · Durable Objects · AI · Hyperdrive · placement ·
limits · tail) live in `wrangler.toml`, not here — the **full commented reference is `code/shared/api/wrangler.toml`**.

## Turnstile keys → the app

The widget's keys are Terraform **outputs**. After `apply`:

```bash
pnpm infra:website:output:prod
# turnstile_site_key = "0x4AAA…"   → NEXT_PUBLIC_TURNSTILE_SITE_KEY (public)
# turnstile_secret   = <sensitive> → TURNSTILE_SECRET (server)
```

Put the **site key** in the app env (public) and the **secret** via `secrets:sync:website:prod` (never
commit it). Until they're set, the form guard runs on honeypot + origin + rate-limit + body-cap;
Turnstile just no-ops. See [Security headers](/apps/web/seo/security-headers) + `@indiecrafts/security`.

## Caching, end to end

- **App (Worker):** OpenNext caches ISR in R2 (`NEXT_INC_CACHE_R2_BUCKET`); its KV cache rides
  Tiered Cache. This layer adds the **edge** cache in front.
- **Edge (here):** immutable `/_next/static` cached a year; `/api` + `/studio` + draft mode never
  cached; Tiered Cache reduces origin hits. Cache Reserve (persistent) is a one-line add if needed.

## Add app #2

Copy `code/projects/web/surfaces/website/infra/` → `code/projects/<platform>/<kind>/<app>/infra/`, point the tfvars at that app's Worker
names + domain, and add `infra:<app>:<action>:<env>` delegators (mirroring `infra:website:*`). `main.tf` is
self-contained (no shared module); `code/shared/scripts/infra/run.mjs` resolves `code/projects/<platform>/<kind>/<app>/infra`.

> **One app = one Cloudflare zone.** The zone-level resources — SSL/TLS/HTTPS settings, Bot Fight
> Mode, Tiered Cache, and the ruleset entrypoints (a zone has exactly one ruleset per phase) — are
> keyed by `zone_id`, not by `worker_name`. If two apps' states manage the **same** zone they will
> fight over those objects. Give each app its **own zone/domain** (a subdomain on the _same_ zone is
> the collision case). A future `enable_zone_settings` toggle could let a subdomain app skip them.

## State

Local per-workspace state (`terraform.tfstate.d/<env>/`, gitignored — it holds the Turnstile
secret). For a team, switch to **remote state** (Cloudflare **R2** via the Terraform `s3` backend,
or Terraform Cloud) — uncomment the `backend` block in `code/projects/web/surfaces/website/infra/main.tf`. Commit `.tf`, `.tfvars`
(placeholders), and `.terraform.lock.hcl`; never state.

## Verify

`pnpm infra:website:init` then `plan` — Terraform validates the schema against the pinned provider (run
`terraform -chdir=… validate` too; provider schemas evolve — adjust any renamed argument). A green
`plan` shows exactly what will change before `apply`.
