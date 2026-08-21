# Cloudflare edge config for the `web` app — CO-LOCATED + SELF-CONTAINED (the app owns
# its whole deploy surface: `wrangler.toml` ships the Worker, this owns the edge).
# One instance = one app, one environment. Provisions the EDGE config wrangler can't:
#   · auto custom domain (CF makes the DNS record + cert)
#   · rate-limit on /api/* (the @indiecrafts/packages-shared-security `withGuard` PRIMARY limiter)
#   · Cloudflare Managed WAF · Bot Fight Mode
#   · cache rules (immutable /_next/static, bypass /api + /studio) + Tiered Cache
#   · zone hardening (SSL strict, min TLS 1.2, Always-HTTPS)
#   · a Turnstile widget → outputs the site + secret keys for the app env
#
# PER APP (this dir) × PER ENV (one Terraform workspace + tfvars per env). Apply with
# the `infra:web:*:<env>` delegators (root package.json):
#   pnpm infra:web:plan:prod     # review the diff
#   pnpm infra:web:apply:prod    # provision
#
# To reuse for another app: copy this whole dir to code/projects/<app>/infra and
# retarget the tfvars. Written for the cloudflare provider ~> 5 — run
# `terraform init && validate` against the pinned version before the first apply.

terraform {
  required_version = ">= 1.6"
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 5" }
  }

  # State: LOCAL by default — one file per WORKSPACE (= env) under
  # `terraform.tfstate.d/` (gitignored). Fine for a solo operator.
  #
  # For a TEAM, uncomment a remote backend so state is shared + locked. Cloudflare
  # R2 is S3-compatible (set the R2 keys as AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY):
  #   backend "s3" {
  #     bucket                      = "indiecrafts-tfstate"                                  # create this R2 bucket first
  #     key                         = "web/terraform.tfstate"                                # per app
  #     region                      = "auto"
  #     endpoints                   = { s3 = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com" }
  #     skip_credentials_validation = true
  #     skip_region_validation      = true
  #     skip_requesting_account_id  = true
  #     skip_metadata_api_check     = true
  #     skip_s3_checksum            = true
  #     use_path_style              = true
  #   }
  # (or Terraform Cloud — `cloud { organization = "…"  workspaces { name = "web-<env>" } }`.)
}

# Reads CLOUDFLARE_API_TOKEN from the environment (scoped token — Zone: DNS/Cache/WAF
# edit; Account: Workers/Turnstile edit). See docs/infra/cloudflare-iac.md.
provider "cloudflare" {}

# ── Inputs (per app · per env — set in env/<env>.tfvars) ─────────────────────
variable "account_id" { type = string }
variable "zone_id" { type = string, default = "" }
variable "worker_name" { type = string } # matches wrangler `name` for this env (e.g. slug-web-prod)
variable "env" { type = string }         # dev | staging | prod
variable "domain" { type = string, default = "" }
variable "attach_domain" { type = bool, default = true } # false for dev/workers.dev
variable "turnstile_domains" { type = list(string), default = [] }
# Edge tunables — defaults are sensible; override in tfvars if needed.
variable "rate_limit_requests" { type = number, default = 20 }
variable "rate_limit_period" { type = number, default = 60 } # seconds
variable "enable_managed_waf" { type = bool, default = true }
variable "enable_bot_fight" { type = bool, default = true }
variable "enable_leaked_credentials" { type = bool, default = true } # managed-challenge known-leaked creds (Free: one field)
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
    ref               = "cf_managed"
    description       = "Deploy the Cloudflare Managed Ruleset"
    expression        = "true"
    action            = "execute"
    action_parameters = { id = "efb7b8c949ac4650a09736fc376e9aee" } # Cloudflare Managed Ruleset (well-known id)
  }]
}

# ── Bot Fight Mode (free) ─────────────────────────────────────────────────────
# `fight_mode` challenges known bots on the Free plan. Turn on **Block AI Bots** too
# (Security → Settings → Bot traffic) to block AI crawlers (GPTBot, ClaudeBot, …) — the
# provider field for that varies by version, so it's a dashboard toggle here.
resource "cloudflare_bot_management" "bots" {
  count      = var.enable_bot_fight ? 1 : 0
  zone_id    = var.zone_id
  fight_mode = true
}

# ── Leaked-credentials detection (free: one field) ────────────────────────────
# Managed-challenge any request Cloudflare flags as carrying a known-breached
# username+password (credential stuffing). Requires leaked-credentials DETECTION to be
# enabled on the zone first (Security → Settings). The `cf.waf.credential_check.*`
# field is available on Free (one field); paid plans get more granular fields.
resource "cloudflare_ruleset" "leaked_credentials" {
  count   = var.enable_leaked_credentials ? 1 : 0
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
      description       = "Never cache the API, Studio, or draft mode"
      expression        = "(starts_with(http.request.uri.path, \"/api/\") or starts_with(http.request.uri.path, \"/studio\"))"
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

# ── Optional: a first-party asset CDN on your own domain (Sanity content keeps
#    its own CDN — this is for /_next/static + /public served via `assetPrefix`).
#    Uncomment + point NEXT_PUBLIC_CDN_URL at this host (per env, in the GitHub
#    Environment / wrangler [env.*.vars]). See docs/apps/web/config/images.md.
# resource "cloudflare_workers_custom_domain" "cdn" {
#   count       = var.attach_domain ? 1 : 0
#   account_id  = var.account_id
#   zone_id     = var.zone_id
#   hostname    = "cdn.${var.domain}"   # e.g. cdn.example.com / cdn-staging.example.com
#   service     = var.worker_name
#   environment = "production"
# }
#
# ── Optional: Cloudflare Image Transformations for FIRST-PARTY images (NOT
#    Sanity content — Sanity's CDN optimises those). Enable on the zone, then use
#    a `/cdn-cgi/image/width=<w>,quality=<q>,format=auto,fit=scale-down/<src>` loader.
#    "on" = same-origin only; "open" = any origin (higher cost/abuse surface).
# resource "cloudflare_zone_setting" "image_resizing" {
#   zone_id    = var.zone_id
#   setting_id = "image_resizing"
#   value      = "on"
# }
#
# ── Zero Trust Access — gate the ADMIN app behind SSO (the registry says: add a
#    Cloudflare Access gate before shipping admin). This block belongs in the ADMIN
#    app's OWN infra/cloudflare (copy this dir there); shown here as the reference.
#    Protects `admin.<domain>` — only the listed emails/domain reach the Worker.
# resource "cloudflare_zero_trust_access_application" "admin" {
#   account_id       = var.account_id
#   zone_id          = var.zone_id
#   name             = "${var.worker_name}-admin"
#   domain           = "admin.${var.domain}"
#   type             = "self_hosted"
#   session_duration = "24h"
# }
# resource "cloudflare_zero_trust_access_policy" "admin_allow" {
#   account_id     = var.account_id
#   application_id = cloudflare_zero_trust_access_application.admin.id
#   name           = "team-only"
#   decision       = "allow"
#   precedence     = 1
#   include        = [{ email_domain = { domain = "your-company.com" } }]
#   # or: include = [{ email = { email = "you@your-company.com" } }]
# }
#
# ── Redirect rule — www → apex (or apex → www). Single-redirect, at the edge.
# resource "cloudflare_ruleset" "redirect" {
#   zone_id = var.zone_id
#   name    = "${var.worker_name}-redirects"
#   kind    = "zone"
#   phase   = "http_request_dynamic_redirect"
#   rules = [{
#     ref         = "www_to_apex"
#     description = "www → apex"
#     expression  = "(http.host eq \"www.${var.domain}\")"
#     action      = "redirect"
#     action_parameters = { from_value = {
#       status_code = 301
#       target_url  = { expression = "concat(\"https://${var.domain}\", http.request.uri.path)" }
#       preserve_query_string = true
#     } }
#   }]
# }
#
# ── DNS record — only if CF is NOT already fronting the apex (the custom-domain
#    resource makes its own record). Example: a mail/verification TXT.
# resource "cloudflare_dns_record" "txt" {
#   zone_id = var.zone_id
#   name    = var.domain
#   type    = "TXT"
#   content = "v=spf1 include:_spf.mx.cloudflare.net ~all"
#   ttl     = 1
# }
#
# ── Logpush — ship Worker/HTTP logs to R2/S3/a SIEM (compliance / retention).
# resource "cloudflare_logpush_job" "http" {
#   zone_id          = var.zone_id
#   name             = "${var.worker_name}-http"
#   dataset          = "http_requests"
#   destination_conf = "r2://indiecrafts-prod-web-website-logs/http?account-id=${var.account_id}&access-key-id=<>&secret-access-key=<>"
#   enabled          = true
# }

# ── Outputs (feed the app env) ────────────────────────────────────────────────
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
