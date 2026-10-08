---
title: "Cloudflare as code (domain · security · cache)"
description: "Terraform provisions the Cloudflare edge — the parts wrangler.toml can't express (WAF and rate-limit rules, cache rules, bot mode)."
status: stable
---

# Cloudflare as code (domain · security · cache)

Terraform provisions the Cloudflare **edge** — the parts `wrangler.toml` can't express (WAF and
rate-limit rules, cache rules, bot mode). Clean split:

- **`wrangler`** deploys the **Worker** (`deploy:web:website:<env>`).
- **Terraform** owns the **edge**: auto custom domain · WAF · rate-limit · Bot Fight Mode · cache
  rules · Tiered Cache · zone hardening · the Turnstile widget.

The Terraform is **co-located with each app and self-contained**: `code/projects/<platform>/<kind>/<app>/infra/` holds one
`main.tf` (provider + vars + all edge resources + outputs) + **per-env** tfvars — no shared module.
Written for the `cloudflare/cloudflare ~> 5` provider.

## Per app × per env

State is isolated **per env** in a Terraform **workspace**; values come from `env/<env>.tfvars`.
The delegators mirror the deploy scripts (`deploy:web:website:<env>` → `infra:web:website:<action>:<env>`):

```bash
export CLOUDFLARE_API_TOKEN=…        # scoped — see Prerequisites

pnpm infra:web:website:init                  # one-time: terraform init
pnpm infra:web:website:plan:prod             # review the diff (does nothing)
pnpm infra:web:website:apply:prod            # provision prod
pnpm infra:web:website:apply:staging         # …and staging (separate state)
pnpm infra:web:website:output:prod           # read the Turnstile keys (below)
```

`init | plan | apply | destroy | output` × `dev | staging | prod`. Under the hood:
`node code/shared/scripts/infra/run.mjs <app> <action> <env>` → `-chdir` into the app dir, `terraform workspace
select <env>`, `-var-file=env/<env>.tfvars`.

**Every stack at once** — `pnpm infra:all <plan|apply> <env>` (`code/shared/scripts/infra/all.mjs`) runs the
stacks in registry order (account → api → website → app → admin → storybook). It **preflights all of them
first** (`lib/tfvars-preflight.mjs`) and sends nothing to Cloudflare while any value is missing: a blank
`account_id`, a blank `zone_id` or domain on an env with `attach_domain = true`, a template `example.com`
host, or no `CLOUDFLARE_API_TOKEN`. `apply` stays interactive — Terraform prints each plan and waits for
`yes`. The single-stack `run.mjs` runs the same preflight.

```bash
export CLOUDFLARE_API_TOKEN=…   # scoped — see Prerequisites
pnpm infra:all plan dev         # review every stack's diff (dev: workers.dev, no zone needed)
pnpm infra:all apply dev        # provision — confirm each stack with "yes"
```

## Prerequisites

- **Terraform ≥ 1.6** (`brew install terraform`).
- **`CLOUDFLARE_API_TOKEN`** — a **scoped** token (dashboard → My Profile → API Tokens):
  _Zone_ → DNS · Cache Rules · Config · WAF · Zone Settings **Edit**; _Account_ → Workers Scripts ·
  Turnstile **Edit**. Never commit it.
- Fill `code/projects/web/surfaces/website/infra/env/<env>.tfvars` — `account_id`, `zone_id` (the domain's zone), and `domain`.
  `project:rename <slug>` rewrites `worker_name` to match the wrangler names.

## What it provisions (`code/projects/web/surfaces/website/infra/main.tf`)

| Resource                                | Effect                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudflare_workers_custom_domain`      | **auto domain** — attaches `<domain>` to the env's Worker; CF makes the DNS record + cert. **Authoritative** — do NOT also uncomment the `[[env.*.routes]]` block in `wrangler.toml` (both claim the hostname and fight); gate with `attach_domain`                                                                                                                                                                                                                                                                                           |
| `cloudflare_ruleset` (http_ratelimit)   | **tiered rate-limit on `/api/*`** — a tighter cap on the form/report endpoints (`rate_limit_form_requests`, default 10) then a general `/api/*` cap (`rate_limit_requests`, default 20); the `@indiecrafts/packages-shared-security` `withGuard`/CSP-sink **primary** limiter                                                                                                                                                                                                                                                                 |
| `cloudflare_ruleset` (firewall_managed) | Cloudflare **Managed WAF** ruleset                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `cloudflare_ruleset` (firewall_custom)  | **custom firewall** (one per phase): **block** sensitive-file probes (`.env`/`.git`/`.sql`/`wp-*`) before the Worker · **(opt-in `block_bad_bots`)** managed-challenge scraper UAs on content routes · **(opt-in `enable_leaked_credentials`)** leaked-credential challenge. Regex-free (`ends_with`/`contains`/`lower`)                                                                                                                                                                                                                      |
| `cloudflare_bot_management`             | **Bot Fight Mode** (free) on — malicious automation only. The AI-crawler settings are **pinned off** (`ai_bots_protection` / `crawler_protection` = `"disabled"`, `is_robots_txt_managed = false`) and identical in every stack on the zone (test: `infra-registry.test.mjs`). Never turn on **Block AI Bots**: it also blocks Googlebot, Bingbot and the AI search crawlers. The training opt-out lives in `robots.txt` ([robots](/projects/web/website/seo/robots-and-environments)). Upgrade to Super Bot Fight Mode on Pro for skip rules |
| `cloudflare_ruleset` (cache_settings)   | **Cache Rules** — immutable `/_next/static`, **bypass** `/api` + `/studio`                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `cloudflare_tiered_cache`               | **Tiered Cache** — funnel misses through one upper-tier PoP                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `cloudflare_zone_setting` ×3            | SSL **strict** · min TLS **1.2** · Always-Use-HTTPS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `cloudflare_turnstile_widget`           | provisions the widget → outputs the keys (below)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Toggle any off per env via the `enable_*` variables in the tfvars.

**Commented optionals in `main.tf`** (uncomment + fill to activate — configure a maximum at the edge):

| Resource                                               | For                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudflare_workers_custom_domain` (cdn)               | a first-party asset CDN on `cdn.<domain>` (`assetPrefix`)                                                                                                                                                                                                                                   |
| `cloudflare_zone_setting` (image_resizing)             | CF Image Transformations for first-party images                                                                                                                                                                                                                                             |
| `cloudflare_zero_trust_access_application` + `_policy` | **admin only — SSO gate** on the admin host. Provider v5: the policy is a reusable **account-level** object; the application (account-scoped — `account_id` or `zone_id`, never both) attaches it with `policies = [{ id, precedence }]`. Copy from the admin stack to gate another surface |
| `cloudflare_ruleset` (dynamic_redirect)                | www → apex (single redirect at the edge)                                                                                                                                                                                                                                                    |
| `cloudflare_dns_record`                                | extra records (SPF/TXT/verification) when CF isn't already fronting the apex                                                                                                                                                                                                                |
| `cloudflare_logpush_job`                               | ship HTTP/Worker logs to R2/SIEM (retention / compliance)                                                                                                                                                                                                                                   |

The Worker's own bindings (KV · R2 · D1 · queues · services · Durable Objects · AI · Hyperdrive · placement ·
limits · tail) live in `wrangler.toml`, not here — the **full commented reference is `code/shared/api/wrangler.toml`**.

## Turnstile keys → the app

The widget's keys are Terraform **outputs**. After `apply`:

```bash
pnpm infra:web:website:output:prod
# turnstile_site_key = "0x4AAA…"   → NEXT_PUBLIC_TURNSTILE_SITE_KEY (public)
# turnstile_secret   = <sensitive> → TURNSTILE_SECRET (server)
```

Put the **site key** in the app env (public) and the **secret** via `secrets:sync:web:website:prod` (never
commit it). Until they're set, the form guard runs on honeypot + origin + rate-limit + body-cap;
Turnstile just no-ops. See [Security headers](/projects/web/website/seo/security-headers) + `@indiecrafts/packages-shared-security`.

## Caching, end to end

- **App (Worker):** OpenNext caches ISR in R2 (`NEXT_INC_CACHE_R2_BUCKET`); its KV cache rides
  Tiered Cache. This layer adds the **edge** cache in front.
- **Edge (here):** immutable `/_next/static` cached a year; `/api` + `/studio` + draft mode never
  cached; Tiered Cache reduces origin hits. Cache Reserve (persistent) is a one-line add if needed.

## Stacks (all eligible surfaces)

Every Cloudflare-deployable surface that can take edge config now ships its own self-contained stack,
registered in `code/shared/scripts/lib/infra-registry.mjs` and driven by the `infra:*` delegators
(`code/shared/scripts/infra/run.mjs` resolves each `dir`):

| Stack       | Altitude | Dir                                    | Notes                                                                                                                      |
| ----------- | -------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `account`   | global   | `code/shared/infra/cloudflare/account` | account-wide config: the Zero Trust one-time-PIN identity provider (`manage_access_idp`, staging only); the rest commented |
| `api`       | global   | `code/shared/api/infra/cloudflare`     | rate-limit `/v1/*` · WAF · bot · leaked-creds · zone hardening                                                             |
| `website`   | leaf     | `…/surfaces/website/infra/cloudflare`  | full next-cf edge + Turnstile                                                                                              |
| `app`       | leaf     | `…/surfaces/app/infra/cloudflare`      | website-style edge                                                                                                         |
| `admin`     | leaf     | `…/surfaces/admin/infra/cloudflare`    | website edge **+ Cloudflare Zero Trust Access** (SSO-gated)                                                                |
| `storybook` | leaf     | `…/tools/storybook/infra/cloudflare`   | minimal (custom domain + zone hardening)                                                                                   |

To add another app, copy the closest stack dir, point the tfvars at that app's Worker name + domain, and
add `infra:<scope>:<app>:<action>:<env>` delegators (mirroring the existing ones). `main.tf` is
self-contained (no shared module).

### One owner per zone

The zone-wide resources are **singletons**: a zone has exactly one ruleset per phase (rate-limit, WAF,
custom firewall, cache), one bot-management config, one Tiered Cache setting and one value per zone
setting (SSL, min TLS, Always-HTTPS). They are keyed by `zone_id`, not `worker_name`, so two stacks (or
two envs of one stack) that both create them on the same zone fight over them.

Every stack gates them behind `local.manage_zone = var.attach_domain && var.manage_zone`
(`manage_zone` defaults to `true`). Exactly **one stack × env per zone** keeps it `true`; every other
stack on that zone sets `manage_zone = false` in its tfvars and inherits the owner's rules. The template
ships:

| Zone              | Owner (`manage_zone = true`) | Same zone, `manage_zone = false`                                            |
| ----------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `example.com`     | `website` / prod             | `website` / staging · `admin` + `app` / staging + prod · `storybook` / prod |
| `indiecrafts.dev` | `api` / prod                 | —                                                                           |

The owner's rules are path-based, not host-based, so they cover every host on the zone: the `/api/*`
rate limits, WAF, sensitive-path block, leaked-credential check, Bot Fight and TLS apply to `admin.` and
`app.` too. Two stack-specific rules do not follow a non-owner: the api's `/v1/` edge rate limit (the api
Worker already enforces its native `RATELIMIT` binding) and storybook's `/assets/` cache rule (Workers
Assets caches them anyway). Give a surface its own zone and `manage_zone = true` to keep its own rules.
`pnpm test:scripts` fails if two stack × env pairs own one zone, or a zone singleton is not gated.

## State

Local per-workspace state (`terraform.tfstate.d/<env>/`, gitignored — it holds the Turnstile
secret). For a team, switch to **remote state** (Cloudflare **R2** via the Terraform `s3` backend,
or Terraform Cloud) — uncomment the `backend` block in the stack's `infra/cloudflare/main.tf`. Commit `.tf`, `.tfvars`
(placeholders), and `.terraform.lock.hcl`; never state.

## Verify

**`pnpm check:infra`** (in `pnpm verify` and the CI `infra` job) checks every stack in the registry,
creds-free, in a temp copy: `terraform fmt`, `validate` (a warning fails too — provider deprecations
surface early), then a `plan` for each env's tfvars against a **mocked provider** (`terraform test` +
`mock_provider`, with format-valid dummy `account_id`/`zone_id` since the tfvars ship them blank). It
catches HCL errors, provider-schema changes and bad tfvars values before anyone runs a real plan.
Locally it skips when `terraform` is not installed; in CI it is required (pinned `1.16.4`).

Each stack commits its **`.terraform.lock.hcl`** — the provider version (`cloudflare/cloudflare` 5.26)
and its hashes for macOS (arm64 + Intel) and Linux CI. After a provider bump, refresh it with
`terraform -chdir=<stack> providers lock -platform=darwin_arm64 -platform=darwin_amd64 -platform=linux_amd64`.

Then the real run: `pnpm infra:<scope>:<app>:init`, `plan:<env>` (needs `CLOUDFLARE_API_TOKEN`) — a
green `plan` shows exactly what will change before `apply`.
