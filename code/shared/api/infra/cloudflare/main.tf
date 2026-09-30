# Cloudflare edge config for the shared `api` Worker — CO-LOCATED + SELF-CONTAINED (the
# service owns its whole deploy surface: `wrangler.toml` ships the Worker, this owns the
# edge). A trimmed sibling of the website's stack: the api is a BARE JSON Worker, so there
# is no Turnstile (no forms) and no Next static-cache rules. It provisions:
#   · a custom domain (api.<root>) → the api Worker (CF makes the DNS record + cert)
#   · a zone rate-limit on /v1/* (DEFENCE IN DEPTH on top of the inline bearer/rate-limit
#     guard in src/index.ts — the worker guard stays the primary, this is the blunt backstop)
#   · Cloudflare Managed WAF · Bot Fight Mode · leaked-credentials challenge
#   · zone hardening (SSL strict, min TLS 1.2, Always-HTTPS)
#
# INERT until the api has a real zone: `attach_domain = false` (dev/staging → *.workers.dev)
# and the WAF/rate-limit resources are zone-scoped, so they apply only once `zone_id` is set.
# The inline guard protects the Worker regardless (works on *.workers.dev too).
#
# PER ENV (one Terraform workspace + tfvars per env). Apply with the `infra:api:*:<env>`
# delegators (root package.json):
#   pnpm infra:api:plan:prod     # review the diff
#   pnpm infra:api:apply:prod    # provision
#
# Written for the cloudflare provider ~> 5 — run `terraform init && validate` against the
# pinned version before the first apply. Full runbook → code/docs/shared/infra/cloudflare-iac.md.

terraform {
  required_version = ">= 1.6"
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 5" }
  }
  # State: LOCAL by default (one file per WORKSPACE = env, gitignored). For a TEAM,
  # uncomment a remote backend (R2 via the s3 backend, or Terraform Cloud) — see the
  # website stack's main.tf for the full block.
}

# Reads CLOUDFLARE_API_TOKEN from the environment (scoped: Zone DNS/WAF edit + Account
# Workers edit). See code/docs/shared/infra/cloudflare-iac.md.
provider "cloudflare" {}

# ── Inputs (per env — set in env/<env>.tfvars) ───────────────────────────────
variable "account_id" { type = string }
variable "zone_id" {
  type    = string
  default = ""
}
variable "worker_name" { type = string } # matches wrangler `name` for this env (indiecrafts-<env>-shared-api)
variable "env" { type = string }         # dev | staging | prod
# e.g. api.example.com
variable "domain" {
  type    = string
  default = ""
}
# false for dev/workers.dev
variable "attach_domain" {
  type    = bool
  default = true
}
variable "manage_zone" {
  # A zone holds ONE of each zone-wide setting (entrypoint rulesets, bot management, tiered
  # cache, TLS). Exactly one stack × env per zone sets this true; the others on that zone
  # (subdomains, staging next to prod) set it false and inherit the owner's rules.
  type    = bool
  default = true
}
locals {
  # Zone-wide resources need a real zone: none on *.workers.dev (attach_domain = false).
  manage_zone = var.attach_domain && var.manage_zone
}
# Edge tunables — sensible defaults; override in tfvars. The inline guard is the primary
# limiter, so the zone limit is generous (a DDoS backstop, not the per-endpoint gate).
variable "rate_limit_requests" {
  type    = number
  default = 60
}
# seconds
variable "rate_limit_period" {
  type    = number
  default = 60
}
variable "enable_managed_waf" {
  type    = bool
  default = true
}
variable "enable_bot_fight" {
  type    = bool
  default = true
}
variable "enable_leaked_credentials" {
  type    = bool
  default = true
}

# ── Auto domain: attach api.<root> to the Worker (CF makes DNS + cert) ────────
resource "cloudflare_workers_custom_domain" "api" {
  count      = var.attach_domain ? 1 : 0
  account_id = var.account_id
  zone_id    = var.zone_id
  hostname   = var.domain
  service    = var.worker_name
}

# ── Rate limit on /v1/* — DEFENCE IN DEPTH (the inline guard is the primary) ──
resource "cloudflare_ruleset" "rate_limit" {
  count   = local.manage_zone ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-ratelimit"
  kind    = "zone"
  phase   = "http_ratelimit"
  rules = [{
    ref         = "api_rate_limit"
    description = "Rate-limit the versioned API routes (${var.env})"
    expression  = "(starts_with(http.request.uri.path, \"/v1/\"))"
    action      = "block"
    ratelimit = {
      characteristics     = ["ip.src", "cf.colo.id"]
      period              = var.rate_limit_period
      requests_per_period = var.rate_limit_requests
      mitigation_timeout  = var.rate_limit_period
    }
  }]
}

# ── Cloudflare Managed WAF ruleset ───────────────────────────────────────────
resource "cloudflare_ruleset" "waf_managed" {
  count   = local.manage_zone && var.enable_managed_waf ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-waf"
  kind    = "zone"
  phase   = "http_request_firewall_managed"
  rules = [{
    ref               = "cf_managed"
    description       = "Deploy the Cloudflare Managed Ruleset"
    expression        = "true"
    action            = "execute"
    action_parameters = { id = "efb7b8c949ac4650a09736fc376e9aee" } # Cloudflare Managed Ruleset (well-known id)
  }]
}

# ── Bot Fight Mode (free) — MALICIOUS automation only ─────────────────────────
# Challenges abusive bots (scrapers/attackers). Do NOT enable "Block AI Bots" — this is a
# JSON API (not indexable content), but that toggle would also block legit AI search/fetch
# agents. AI-training opt-out for the CONTENT site is handled by the website's robots.txt.
resource "cloudflare_bot_management" "bots" {
  count      = local.manage_zone && var.enable_bot_fight ? 1 : 0
  zone_id    = var.zone_id
  fight_mode = true
  # Pin the AI-crawler settings instead of inheriting Cloudflare's zone defaults (new
  # domains block training + agent crawlers on ad pages since 2026-09-15, and a training
  # block also stops multi-purpose crawlers like Googlebot and Bingbot). robots.txt owns
  # the training opt-out; the edge must not add its own block or rewrite robots.txt.
  ai_bots_protection    = "disabled"
  crawler_protection    = "disabled"
  is_robots_txt_managed = false
}

# ── Leaked-credentials detection (free: one field) ────────────────────────────
# Managed-challenge any request Cloudflare flags as carrying known-breached credentials.
# Requires leaked-credentials DETECTION enabled on the zone first (Security → Settings).
resource "cloudflare_ruleset" "leaked_credentials" {
  count   = local.manage_zone && var.enable_leaked_credentials ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-leaked-creds"
  kind    = "zone"
  phase   = "http_request_firewall_custom"
  rules = [{
    ref         = "leaked_creds_challenge"
    description = "Managed-challenge requests with known-leaked credentials (${var.env})"
    expression  = "(cf.waf.credential_check.username_and_password_leaked)"
    action      = "managed_challenge"
  }]
}

# ── Zone hardening ───────────────────────────────────────────────────────────
resource "cloudflare_zone_setting" "ssl" {
  count      = local.manage_zone ? 1 : 0
  zone_id    = var.zone_id
  setting_id = "ssl"
  value      = "strict"
}
resource "cloudflare_zone_setting" "min_tls" {
  count      = local.manage_zone ? 1 : 0
  zone_id    = var.zone_id
  setting_id = "min_tls_version"
  value      = "1.2"
}
resource "cloudflare_zone_setting" "always_https" {
  count      = local.manage_zone ? 1 : 0
  zone_id    = var.zone_id
  setting_id = "always_use_https"
  value      = "on"
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "domain" {
  value = var.attach_domain ? var.domain : null
}
