# web · staging. Fill account_id + zone_id + domain (the zone must be on this CF account).
env               = "staging"
worker_name       = "indiecrafts-web-staging"
attach_domain     = true
account_id        = ""                     # REQUIRED
zone_id           = ""                     # REQUIRED (the domain's zone)
domain            = "staging.example.com"  # REQUIRED — your staging host
turnstile_domains = ["staging.example.com"]

# Optional edge tunables — module defaults (uncomment here AND in main.tf to override):
# rate_limit_requests = 20
# rate_limit_period   = 60
# enable_managed_waf  = true
# enable_bot_fight    = true
# enable_cache_rules  = true
# enable_tiered_cache = true
