# Cloudflare edge config for the `web` app — CO-LOCATED + SELF-CONTAINED (the app owns
# its whole deploy surface: `wrangler.toml` ships the Worker, this owns the edge).
# One instance = one app, one environment. Provisions the EDGE config wrangler can't:
#   · auto custom domain (CF makes the DNS record + cert)
#   · rate-limit on /api/* — tiered (tighter on the form/report endpoints), the `withGuard` PRIMARY limiter
#   · Cloudflare Managed WAF · Bot Fight Mode · (opt-in) bad-bot UA challenge
#   · custom firewall: block sensitive-file probes (.env/.git/.sql/wp-*) at the edge · leaked-credential challenge
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
# edit; Account: Workers/Turnstile edit). See code/docs/shared/infra/cloudflare-iac.md.
provider "cloudflare" {}

# ── Inputs (per app · per env — set in env/<env>.tfvars) ─────────────────────
variable "account_id" { type = string }
variable "zone_id" {
  type    = string
  default = ""
}
variable "worker_name" { type = string } # matches wrangler `name` for this env (e.g. slug-web-prod)
variable "env" { type = string }         # dev | staging | prod
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
variable "turnstile_domains" {
  type    = list(string)
  default = []
}
# Edge tunables — defaults are sensible; override in tfvars if needed.
variable "rate_limit_requests" {
  type    = number
  default = 20
}
# seconds
variable "rate_limit_period" {
  type    = number
  default = 60
}
# tighter cap for the abuse-prone form endpoints
variable "rate_limit_form_requests" {
  type    = number
  default = 10
}
variable "enable_managed_waf" {
  type    = bool
  default = true
}
variable "enable_bot_fight" {
  type    = bool
  default = true
}
# managed-challenge known-leaked creds (Free: one field)
variable "enable_leaked_credentials" {
  type    = bool
  default = true
}
# Managed-challenge scraper/automation user-agents on content routes. OFF by default — a
# public marketing site WANTS search bots (robots.txt handles AI-training opt-out), and a
# broad UA rule risks false positives; turn on for a site under active scraping.
variable "block_bad_bots" {
  type    = bool
  default = false
}
variable "enable_cache_rules" {
  type    = bool
  default = true
}
variable "enable_tiered_cache" {
  type    = bool
  default = true
}
# R2 backup lifecycle expiry (GDPR-bounded)
variable "backup_retention_days" {
  type    = number
  default = 30
}

# ── Auto domain: attach the hostname to the Worker (CF makes DNS + cert) ──────
resource "cloudflare_workers_custom_domain" "app" {
  count      = var.attach_domain ? 1 : 0
  account_id = var.account_id
  zone_id    = var.zone_id
  hostname   = var.domain
  service    = var.worker_name
}

# ── Rate limit on /api/* — the guard's PRIMARY limiter ───────────────────────
# Rules evaluate top-down, first match wins: the abuse-prone form/report endpoints get a
# tighter cap, everything else under /api/* falls through to the general limit. Both key on
# client IP + colo (the same trusted derivation the in-app `withGuard`/CSP-sink limiter uses).
resource "cloudflare_ruleset" "rate_limit" {
  count   = local.manage_zone ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-ratelimit"
  kind    = "zone"
  phase   = "http_ratelimit"
  rules = [
    {
      ref         = "form_rate_limit"
      description = "Tighter cap on the abuse-prone form + report endpoints (${var.env})"
      expression  = "(http.request.uri.path in {\"/api/data-request\" \"/api/contact\" \"/api/comments\" \"/api/newsletter\" \"/api/waitlist\" \"/api/csp-report\"})"
      action      = "block"
      ratelimit = {
        characteristics     = ["ip.src", "cf.colo.id"]
        period              = var.rate_limit_period
        requests_per_period = var.rate_limit_form_requests
        mitigation_timeout  = var.rate_limit_period
      }
    },
    {
      ref         = "api_rate_limit"
      description = "General rate-limit for the rest of /api/* (${var.env})"
      expression  = "(starts_with(http.request.uri.path, \"/api/\"))"
      action      = "block"
      ratelimit = {
        characteristics     = ["ip.src", "cf.colo.id"]
        period              = var.rate_limit_period
        requests_per_period = var.rate_limit_requests
        mitigation_timeout  = var.rate_limit_period
      }
    }
  ]
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
# `fight_mode` challenges known malicious / abusive bots on the Free plan (scrapers,
# attackers) — NOT legitimate crawlers.
#
# ⚠ Do NOT enable Cloudflare's "Block AI Bots" (Security → Settings → Bot traffic): it
# blocks AI crawlers INDISCRIMINATELY — including the search + user-fetch agents you WANT
# (Googlebot / AI Overviews, OAI-SearchBot, ChatGPT-User, Claude-User, Claude-SearchBot,
# PerplexityBot). The AI-**training** opt-out is handled precisely in robots.txt
# (`AI_TRAINING_USER_AGENTS` in `@/config` → `src/app/robots.txt`): training bots (GPTBot,
# ClaudeBot, Google-Extended, CCBot, …) get `Disallow: /`, while search + user-fetch fall
# through to `User-agent: *`. That keeps the site accessible + citable but NOT used for
# training. See docs/projects/web/website/seo/robots-and-environments.md.
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
#
# ── Optional: ENFORCE the training opt-out at the edge (defence in depth) ──────
# robots.txt is advisory — a rogue training crawler can ignore it. To HARD-block the
# training UAs at the edge (still allowing search + user-fetch), add this rule to the
# `firewall_custom` ruleset below. It blocks ONLY the training tokens — never OAI-SearchBot,
# ChatGPT-User, Claude-User, Claude-SearchBot, PerplexityBot, or Googlebot:
#   {
#     ref         = "block_ai_training_edge"
#     description = "Block AI *training* crawler UAs at the edge (robots.txt is advisory)"
#     expression  = "(lower(http.user_agent) contains \"gptbot\" or lower(http.user_agent) contains \"ccbot\" or lower(http.user_agent) contains \"google-extended\" or lower(http.user_agent) contains \"claudebot\" or lower(http.user_agent) contains \"anthropic-ai\" or lower(http.user_agent) contains \"bytespider\" or lower(http.user_agent) contains \"applebot-extended\" or lower(http.user_agent) contains \"meta-externalagent\" or lower(http.user_agent) contains \"facebookbot\" or lower(http.user_agent) contains \"amazonbot\" or lower(http.user_agent) contains \"pangubot\" or lower(http.user_agent) contains \"ai2bot\" or lower(http.user_agent) contains \"cohere-training-data-crawler\")"
#     action      = "block"
#   }
# Keep the UA list in sync with AI_TRAINING_USER_AGENTS (code/packages/shared/config/src/web/seo.ts).

# ── Custom firewall (one ruleset per phase) ───────────────────────────────────
# A zone allows only ONE http_request_firewall_custom entrypoint, so every custom rule
# lives here, evaluated top-down (a terminating `block` stops evaluation):
#   1. block sensitive-file probes (.env/.git/.sql/wp-*) at the edge — never reach the Worker
#   2. (opt-in) managed-challenge scraper user-agents on content routes
#   3. (opt-in) managed-challenge requests carrying known-leaked credentials
# Uses only ends_with/contains/lower (no regex) to keep the expressions robust.
resource "cloudflare_ruleset" "firewall_custom" {
  count   = local.manage_zone ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-firewall"
  kind    = "zone"
  phase   = "http_request_firewall_custom"
  rules = concat(
    [
      {
        ref         = "block_sensitive_paths"
        description = "Block probes for dotfiles/backups/CMS paths before the Worker (${var.env})"
        expression  = "(http.request.uri.path contains \"/.env\" or http.request.uri.path contains \"/.git\" or http.request.uri.path contains \"wp-config\" or http.request.uri.path contains \"/wp-admin\" or http.request.uri.path contains \"/wp-login\" or ends_with(http.request.uri.path, \".env\") or ends_with(http.request.uri.path, \".sql\") or ends_with(http.request.uri.path, \".bak\") or ends_with(http.request.uri.path, \".ini\") or ends_with(http.request.uri.path, \".conf\") or ends_with(http.request.uri.path, \".yaml\") or ends_with(http.request.uri.path, \".yml\") or ends_with(http.request.uri.path, \".sh\"))"
        action      = "block"
      }
    ],
    var.block_bad_bots ? [
      {
        ref         = "block_bad_bots"
        description = "Managed-challenge scraper/automation user-agents on content routes (${var.env})"
        expression  = "(not starts_with(http.request.uri.path, \"/api/\") and (lower(http.user_agent) contains \"scrapy\" or lower(http.user_agent) contains \"python-requests\" or lower(http.user_agent) contains \"curl/\" or lower(http.user_agent) contains \"wget/\" or lower(http.user_agent) contains \"headlesschrome\" or lower(http.user_agent) contains \"puppeteer\" or lower(http.user_agent) contains \"selenium\" or lower(http.user_agent) contains \"phantomjs\"))"
        action      = "managed_challenge"
      }
    ] : [],
    var.enable_leaked_credentials ? [
      {
        ref         = "leaked_creds_challenge"
        description = "Managed-challenge requests with known-leaked credentials (${var.env})"
        expression  = "(cf.waf.credential_check.username_and_password_leaked)"
        action      = "managed_challenge"
      }
    ] : []
  )
}

# ── Cache Rules: immutable static at the edge, never cache dynamic ───────────
resource "cloudflare_ruleset" "cache" {
  count   = local.manage_zone && var.enable_cache_rules ? 1 : 0
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
  count   = local.manage_zone && var.enable_tiered_cache ? 1 : 0
  zone_id = var.zone_id
  value   = "on"
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

# ── Turnstile widget → keys the app consumes ─────────────────────────────────
resource "cloudflare_turnstile_widget" "forms" {
  account_id = var.account_id
  name       = "${var.worker_name}-forms"
  domains    = var.turnstile_domains
  mode       = "managed"
}

# ── Project-wide backups bucket (all dbs' dumps, keyed <name>/…) ──────────────
# ONE R2 bucket per env for every db's backup — matches `uploadToR2` in
# scripts/lib/backup-common.mjs (`<prefix>-<env>-db-backup`). The prefix is the project
# slug (first `-`-segment of the worker name), so it follows `pnpm project:rename`. EU
# jurisdiction keeps the PII dumps EU-resident, like the audit D1 (weur). `db:migrate`
# writes a pre-migration snapshot here; the nightly workflow writes daily dumps.
resource "cloudflare_r2_bucket" "db_backup" {
  account_id   = var.account_id
  name         = "${split("-", var.worker_name)[0]}-${var.env}-db-backup"
  jurisdiction = "eu"
}
# Retention (GDPR-bounded — backups hold PII): a `${var.backup_retention_days}`-day expiry.
# Applied via wrangler for now (the CF-provider lifecycle resource's schema is version-
# sensitive; pin-verify before adopting it here):
#   wrangler r2 bucket lifecycle add ${cloudflare_r2_bucket.db_backup.name} --name expire --expire-days ${var.backup_retention_days}
# TODO(iac): move to `cloudflare_r2_bucket_lifecycle` once the schema is confirmed for the pinned provider.

# ── Optional: a first-party asset CDN on your own domain (Sanity content keeps
#    its own CDN — this is for /_next/static + /public served via `assetPrefix`).
#    Uncomment + point NEXT_PUBLIC_CDN_URL at this host (per env, in the GitHub
#    Environment / wrangler [env.*.vars]). See docs/projects/web/website/config/images.md.
# resource "cloudflare_workers_custom_domain" "cdn" {
#   count       = var.attach_domain ? 1 : 0
#   account_id  = var.account_id
#   zone_id     = var.zone_id
#   hostname    = "cdn.${var.domain}"   # e.g. cdn.example.com / cdn-staging.example.com
#   service     = var.worker_name
# }
#
# ── Optional: Cloudflare Image Transformations for FIRST-PARTY images (NOT
#    Sanity content — Sanity's CDN optimises those). Enable on the zone, then use
#    a `/cdn-cgi/image/width=<w>,quality=<q>,format=auto,fit=scale-down/<src>` loader.
#    "on" = same-origin only; "open" = any origin (higher cost/abuse surface).
# resource "cloudflare_zone_setting" "image_resizing" {
#   count = local.manage_zone ? 1 : 0 # zone-wide: only the zone owner
#   zone_id    = var.zone_id
#   setting_id = "image_resizing"
#   value      = "on"
# }
#
# ── Zero Trust Access — the SSO gate lives in the ADMIN app's own stack
#    (code/projects/web/surfaces/admin/infra/cloudflare/main.tf, provider-v5 syntax: an
#    account-level policy attached to the application by id). Copy from there to gate
#    another surface.
#
# ── Redirect rule — www → apex (or apex → www). Single-redirect, at the edge.
# resource "cloudflare_ruleset" "redirect" {
#   count = local.manage_zone ? 1 : 0 # zone-wide: only the zone owner
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
