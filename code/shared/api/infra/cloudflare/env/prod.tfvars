# api · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
# The host mirrors domains.mjs (`api` → api.example.com). Surfaces call this as their API_URL.
env           = "prod"
worker_name   = "indiecrafts-prod-shared-api"
attach_domain = true
account_id    = ""                  # REQUIRED
zone_id       = ""                  # REQUIRED (the domain's zone)
domain        = "api.example.com"   # REQUIRED — your production API host

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
