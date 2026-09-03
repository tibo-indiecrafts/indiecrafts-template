# Cloudflare edge config for the `storybook` static-assets Worker — CO-LOCATED +
# SELF-CONTAINED (the tool owns its whole deploy surface: `wrangler.toml` ships the Worker
# that serves `storybook-static/` via Workers Static Assets, this owns the edge). MINIMAL:
# the gallery is a read-only static site — no API, no forms — so this provisions only:
#   · a custom domain (storybook.<root>) → the Worker (CF makes the DNS record + cert)
#   · zone hardening (SSL strict, min TLS 1.2, Always-HTTPS)
#   · a cache rule for the hashed static assets (immutable, edge-cached for a year)
#
# INERT until storybook has a real zone: `attach_domain = false` (dev → *.workers.dev) leaves
# the zone-scoped resources off; they apply only once `zone_id` + `domain` are set.
#
# PER ENV (one Terraform workspace + tfvars per env). Apply with the `infra:web:storybook:*`
# delegators (root package.json):
#   pnpm infra:web:storybook:plan:prod     # review the diff
#   pnpm infra:web:storybook:apply:prod    # provision
#
# Written for the cloudflare provider ~> 5 — run `terraform init && validate` against the
# pinned version before the first apply. Full runbook → code/docs/infra/cloudflare-iac.md.

terraform {
  required_version = ">= 1.6"
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 5" }
  }
  # State: LOCAL by default (one file per WORKSPACE = env, gitignored). For a TEAM,
  # uncomment a remote backend (R2 via the s3 backend, or Terraform Cloud) — see the
  # website stack's main.tf for the full block.
}

# Reads CLOUDFLARE_API_TOKEN from the environment (scoped: Zone DNS/Cache edit + Account
# Workers edit). See docs/infra/cloudflare-iac.md.
provider "cloudflare" {}

# ── Inputs (per env — set in env/<env>.tfvars) ───────────────────────────────
variable "account_id" { type = string }
variable "zone_id" { type = string, default = "" }
variable "worker_name" { type = string } # matches wrangler `name` for this env (indiecrafts-<env>-web-tools-storybook)
variable "env" { type = string }         # dev | staging | prod
variable "domain" { type = string, default = "" } # e.g. storybook.example.com
variable "attach_domain" { type = bool, default = true } # false for dev/workers.dev

# ── Auto domain: attach storybook.<root> to the Worker (CF makes DNS + cert) ──
resource "cloudflare_workers_custom_domain" "storybook" {
  count       = var.attach_domain ? 1 : 0
  account_id  = var.account_id
  zone_id     = var.zone_id
  hostname    = var.domain
  service     = var.worker_name
  environment = "production" # the CF-side Worker env; wrangler deploys one Worker per --env
}

# ── Cache rule: immutable hashed assets at the edge ──────────────────────────
resource "cloudflare_ruleset" "cache" {
  count   = var.attach_domain ? 1 : 0
  zone_id = var.zone_id
  name    = "${var.worker_name}-cache"
  kind    = "zone"
  phase   = "http_request_cache_settings"
  rules = [{
    ref         = "cache_static_assets"
    description = "Cache hashed Storybook assets at the edge for a year (${var.env})"
    expression  = "(starts_with(http.request.uri.path, \"/assets/\"))"
    action      = "set_cache_settings"
    action_parameters = {
      cache       = true
      edge_ttl    = { mode = "override_origin", default = 31536000 }
      browser_ttl = { mode = "respect_origin" }
    }
  }]
}

# ── Zone hardening ───────────────────────────────────────────────────────────
resource "cloudflare_zone_setting" "ssl" {
  count      = var.attach_domain ? 1 : 0
  zone_id    = var.zone_id
  setting_id = "ssl"
  value      = "strict"
}
resource "cloudflare_zone_setting" "min_tls" {
  count      = var.attach_domain ? 1 : 0
  zone_id    = var.zone_id
  setting_id = "min_tls_version"
  value      = "1.2"
}
resource "cloudflare_zone_setting" "always_https" {
  count      = var.attach_domain ? 1 : 0
  zone_id    = var.zone_id
  setting_id = "always_use_https"
  value      = "on"
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "domain" {
  value = var.attach_domain ? var.domain : null
}
