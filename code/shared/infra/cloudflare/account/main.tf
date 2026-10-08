# Cloudflare ACCOUNT-ALTITUDE config (Terraform) — account-wide settings that are NOT tied
# to one zone or one app. Applied FIRST (lowest `order` in the infra registry). Most
# account-level resources are situational, so they ship here as well-commented OPTIONAL
# blocks — uncomment only what this account actually needs. It manages one thing: the
# Zero Trust identity provider every app's Access gate signs in with.
#
# Per-app EDGE config (WAF · rate-limit · cache · Turnstile · Zero Trust Access) does NOT
# live here — it lives in each app's OWN co-located stack (`<app>/infra/cloudflare`). This
# stack is only for things that span the whole account.
#
# PER ENV (one Terraform workspace + tfvars per env). Apply with the `infra:shared:account:*`
# delegators (root package.json):
#   pnpm infra:shared:account:plan:prod     # review the diff
#   pnpm infra:shared:account:apply:prod    # provision
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

# Reads CLOUDFLARE_API_TOKEN from the environment. For account-altitude work the token needs
# ACCOUNT-level scopes for whatever you enable below (e.g. Zone: Edit to create a zone). See
# code/docs/shared/infra/cloudflare-iac.md.
provider "cloudflare" {}

# ── Inputs (per env — set in env/<env>.tfvars) ───────────────────────────────
variable "account_id" { type = string }
# The account has ONE one-time-PIN identity provider, but three env workspaces target the
# same account — so exactly one env's tfvars sets this (staging, applied first).
variable "manage_access_idp" {
  type    = bool
  default = false
}

# ── Zero Trust identity provider — one-time PIN by email ───────────────────────
# Every Access application (the admin gate in `admin/infra/cloudflare`) uses the account's
# identity providers; with none, the Access login screen has no way to sign in. One-time PIN
# needs no third party: Cloudflare emails a code to the address on the allow-list.
resource "cloudflare_zero_trust_access_identity_provider" "otp" {
  count      = var.manage_access_idp ? 1 : 0
  account_id = var.account_id
  name       = "One-time PIN"
  type       = "onetimepin"
  config     = {}
}

# ── (a) OPTIONAL: create a zone (add a domain to this account) ────────────────
# Usually the zone ALREADY exists — you add a domain to Cloudflare once (dashboard or here),
# then reference its `zone_id` from each app's stack. Uncomment ONLY to manage a zone as code
# (a fresh domain you want Terraform to own). `type = "full"` = Cloudflare is the authoritative
# nameserver — point your registrar's NS at Cloudflare after the apply.
# resource "cloudflare_zone" "root" {
#   account = { id = var.account_id }
#   name    = "example.com"
#   type    = "full"
# }

# ── (b) Account-level settings — NOTE ─────────────────────────────────────────
# Cloudflare exposes very few ACCOUNT-wide settings as Terraform resources; nearly everything
# operational (SSL, TLS, Always-HTTPS, cache, WAF) is ZONE-scoped and belongs in each app's
# own stack (`cloudflare_zone_setting` there). Account-wide items you MIGHT manage here later:
# account API-token policy (the Zero Trust identity provider is managed above). Add one only when a real account-wide
# need appears — keep this stack empty otherwise.

# ── (c) OPTIONAL: an account-level ruleset (shared across all zones) ───────────
# An account-owned custom ruleset can front every zone at once (Enterprise). Most projects
# keep firewall/WAF per-app instead (simpler, per-zone blast radius). Example:
# resource "cloudflare_ruleset" "account_waf" {
#   account_id = var.account_id
#   name       = "account-custom-waf"
#   kind       = "custom"
#   phase      = "http_request_firewall_custom"
#   rules = [{
#     ref         = "block_dotfiles"
#     description = "Example account-wide block rule"
#     expression  = "(http.request.uri.path contains \"/.env\")"
#     action      = "block"
#   }]
# }

# ── (d) Per-app edge lives elsewhere — do NOT add it here ─────────────────────
# WAF · rate-limit · cache rules · Turnstile · Zero Trust Access gates are ZONE-scoped and
# owned by each app's co-located stack: `code/projects/**/infra/cloudflare` and
# `code/shared/{api,agent}/infra/cloudflare`. This account stack stays account-wide only.
