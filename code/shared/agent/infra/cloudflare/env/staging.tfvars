# agent · staging. Placeholder host → *.workers.dev until the operator sets a real
# agent-staging host + zone. Set attach_domain = true once the domain is on this CF account.
env           = "staging"
worker_name   = "indiecrafts-staging-shared-agent"
attach_domain = false
account_id    = "" # REQUIRED
zone_id       = "" # REQUIRED when attach_domain = true
domain        = "" # e.g. agent-staging.example.com

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
