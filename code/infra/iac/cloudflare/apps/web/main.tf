# Cloudflare edge config for the `web` app. PER APP (this dir) × PER ENV (one
# Terraform workspace + tfvars per env). Apply with the `infra:web:*:<env>`
# delegators (root package.json) — they select the `<env>` workspace (state is
# isolated per env) and pass `env/<env>.tfvars`.
#
#   pnpm infra:web:plan:prod     # review the diff
#   pnpm infra:web:apply:prod    # provision
#
# wrangler still deploys the Worker; this owns domain + security + cache only.

terraform {
  required_version = ">= 1.6"
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 5" }
  }
  # State: local, one file per WORKSPACE (= env) under `terraform.tfstate.d/`
  # (gitignored). For a team, switch to remote state (R2 via the s3 backend, or
  # Terraform Cloud) — see ../../README.md.
}

# Reads CLOUDFLARE_API_TOKEN from the environment (scoped token — see ../../README.md).
provider "cloudflare" {}

variable "account_id" { type = string }
variable "zone_id" { type = string, default = "" }
variable "worker_name" { type = string }
variable "env" { type = string }
variable "domain" { type = string, default = "" }
variable "attach_domain" { type = bool, default = true }
variable "turnstile_domains" { type = list(string), default = [] }

module "site" {
  source            = "../../modules/site"
  account_id        = var.account_id
  zone_id           = var.zone_id
  worker_name       = var.worker_name
  env               = var.env
  domain            = var.domain
  attach_domain     = var.attach_domain
  turnstile_domains = var.turnstile_domains
}

output "turnstile_site_key" { value = module.site.turnstile_site_key }
output "turnstile_secret" {
  value     = module.site.turnstile_secret
  sensitive = true
}
output "domain" { value = module.site.domain }
