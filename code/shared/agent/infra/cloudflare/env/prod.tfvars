# agent · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
# The host mirrors domains.mjs (`agent` → agent.example.com). Surfaces call this as their agent endpoint.
env           = "prod"
worker_name   = "indiecrafts-prod-shared-agent"
attach_domain = true
account_id    = ""                  # REQUIRED
zone_id       = ""                  # REQUIRED (the domain's zone)
domain        = "agent.example.com" # REQUIRED — your production agent host

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
