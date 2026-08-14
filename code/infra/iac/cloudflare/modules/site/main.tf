# ─────────────────────────────────────────────────────────────────────────────
# @indiecrafts — reusable Cloudflare "site" module.
#
# One instance = one app, one environment. It provisions the EDGE config that
# `wrangler` can't (wrangler owns the Worker deploy; Terraform owns domain +
# security + cache):
#   · auto custom domain  (CF creates the DNS record + cert)
#   · rate-limit rule on /api/*  (the @indiecrafts/security `withGuard` PRIMARY limiter)
#   · Cloudflare Managed WAF ruleset
#   · Bot Fight Mode (free)
#   · Cache Rules (immutable /_next/static, bypass /api + /studio) + Tiered Cache
#   · zone hardening (SSL strict, min TLS 1.2, Always-Use-HTTPS)
#   · a Turnstile widget  → outputs the site + secret keys for the app env
#
# NB: written for the cloudflare provider ~> 5. Provider resource schemas evolve —
# run `terraform init && terraform validate` against the pinned version before
# first apply; adjust any argument the provider renames.
# ─────────────────────────────────────────────────────────────────────────────

terraform {
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 5" }
  }
}

# ── Inputs (per app · per env) ───────────────────────────────────────────────
variable "account_id" { type = string }
variable "zone_id" { type = string }
variable "worker_name" { type = string } # matches wrangler `name` for this env (e.g. slug-web-prod)
variable "env" { type = string }         # dev | staging | prod
variable "domain" { type = string, default = "" }
variable "attach_domain" { type = bool, default = true } # false for dev/workers.dev
variable "turnstile_domains" { type = list(string), default = [] }
variable "rate_limit_requests" { type = number, default = 20 }
variable "rate_limit_period" { type = number, default = 60 } # seconds
variable "enable_managed_waf" { type = bool, default = true }
variable "enable_bot_fight" { type = bool, default = true }
variable "enable_cache_rules" { type = bool, default = true }
variable "enable_tiered_cache" { type = bool, default = true }

# ── Auto domain: attach the hostname to the Worker (CF makes DNS + cert) ──────
resource "cloudflare_workers_custom_domain" "app" {
  count       = var.attach_domain ? 1 : 0
  account_id  = var.account_id
  zone_id     = var.zone_id
  hostname    = var.domain
  service     = var.worker_name
  environment = "production" # the CF-side Worker env; OpenNext deploys one Worker per wrangler --env
}

# ── Rate limit on /api/* — the guard's PRIMARY limiter ───────────────────────
resource "cloudflare_ruleset" "rate_limit" {
  zone_id = var.zone_id
  name    = "${var.worker_name}-ratelimit"
  kind    = "zone"
  phase   = "http_ratelimit"
  rules = [{
    ref         = "api_rate_limit"
    description = "Rate-limit the public form endpoints (${var.env})"
    expression  = "(starts_with(http.request.uri.path, \"/api/\"))"
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
  count   = var.enable_managed_waf ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-waf"
  kind    = "zone"
  phase   = "http_request_firewall_managed"
  rules = [{
    ref         = "cf_managed"
    description = "Deploy the Cloudflare Managed Ruleset"
    expression  = "true"
    action      = "execute"
    action_parameters = { id = "efb7b8c949ac4650a09736fc376e9aee" } # Cloudflare Managed Ruleset (well-known id)
  }]
}

# ── Bot Fight Mode (free). Note: separate pipeline — no skip/exceptions ───────
resource "cloudflare_bot_management" "bots" {
  count      = var.enable_bot_fight ? 1 : 0
  zone_id    = var.zone_id
  fight_mode = true
}

# ── Cache Rules: immutable static at the edge, never cache dynamic ───────────
resource "cloudflare_ruleset" "cache" {
  count   = var.enable_cache_rules ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-cache"
  kind    = "zone"
  phase   = "http_request_cache_settings"
  rules = [
    {
      ref               = "bypass_dynamic"
      description        = "Never cache the API, Studio, or draft mode"
      expression         = "(starts_with(http.request.uri.path, \"/api/\") or starts_with(http.request.uri.path, \"/studio\"))"
      action            = "set_cache_settings"
      action_parameters = { cache = false }
    },
    {
      ref         = "cache_immutable"
      description = "Cache immutable Next assets at the edge for a year"
      expression  = "(starts_with(http.request.uri.path, \"/_next/static/\"))"
      action      = "set_cache_settings"
      action_parameters = {
        cache       = true
        edge_ttl    = { mode = "override_origin", default = 31536000 }
        browser_ttl = { mode = "respect_origin" }
      }
    }
  ]
}

# ── Tiered Cache — funnel misses through one upper-tier PoP near the Worker ───
resource "cloudflare_tiered_cache" "tc" {
  count   = var.enable_tiered_cache ? 1 : 0
  zone_id = var.zone_id
  value   = "on"
}

# ── Zone hardening ───────────────────────────────────────────────────────────
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = var.zone_id
  setting_id = "ssl"
  value      = "strict"
}
resource "cloudflare_zone_setting" "min_tls" {
  zone_id    = var.zone_id
  setting_id = "min_tls_version"
  value      = "1.2"
}
resource "cloudflare_zone_setting" "always_https" {
  zone_id    = var.zone_id
  setting_id = "always_use_https"
  value      = "on"
}

# ── Turnstile widget → keys the app consumes ─────────────────────────────────
resource "cloudflare_turnstile_widget" "forms" {
  account_id = var.account_id
  name       = "${var.worker_name}-forms"
  domains    = var.turnstile_domains
  mode       = "managed"
}

# ── Outputs (feed the app env) ───────────────────────────────────────────────
output "turnstile_site_key" {
  description = "→ NEXT_PUBLIC_TURNSTILE_SITE_KEY (public, client widget)"
  value       = cloudflare_turnstile_widget.forms.id
}
output "turnstile_secret" {
  description = "→ TURNSTILE_SECRET (server; set via `secrets:sync`, never commit)"
  value       = cloudflare_turnstile_widget.forms.secret
  sensitive   = true
}
output "domain" {
  value = var.attach_domain ? var.domain : null
}
