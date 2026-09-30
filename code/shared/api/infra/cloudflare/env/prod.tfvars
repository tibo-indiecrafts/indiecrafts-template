# api · prod — provisions the custom domain updates.indiecrafts.dev → the api Worker
# (Cloudflare creates the DNS record + TLS cert) plus the zone WAF / rate-limit hardening.
# dev + staging skip all this: attach_domain = false → they serve on *.workers.dev.
#
# ── HOW TO SET UP THE PROD DOMAIN (once, in order) ───────────────────────────
#  1. Add the zone `indiecrafts.dev` to this Cloudflare account and point its
#     nameservers, if it is not already there (CF dashboard → Add a site).
#  2. Copy the zone's ID (zone Overview page → right sidebar → "Zone ID") into
#     `zone_id` below. `account_id` is already filled with this account.
#  3. Confirm `domain` is the host you want — it MUST be inside the zone above.
#  4. Export a scoped API token (Zone: DNS + WAF edit · Account: Workers Scripts edit):
#       export CLOUDFLARE_API_TOKEN=…
#  5. Deploy the Worker first, so the custom domain has a service to bind to:
#       pnpm deploy:shared:api:prod
#  6. Provision the edge:
#       pnpm infra:shared:api:plan:prod     # review the diff
#       pnpm infra:shared:api:apply:prod    # creates updates.indiecrafts.dev → api Worker + cert
#  The Worker is then reachable at https://updates.indiecrafts.dev (surfaces read it as
#  their API_URL). Full runbook → code/docs/shared/infra/cloudflare-iac.md.
# ─────────────────────────────────────────────────────────────────────────────
env           = "prod"
worker_name   = "indiecrafts-prod-shared-api"
attach_domain = true
account_id    = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account
zone_id       = ""                                 # REQUIRED — Zone ID of indiecrafts.dev (step 2)
domain        = "updates.indiecrafts.dev"          # the production API host (inside the zone above)
manage_zone   = true                               # the only stack on indiecrafts.dev — it owns that zone's rules. Set false if the api moves under the website zone

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
