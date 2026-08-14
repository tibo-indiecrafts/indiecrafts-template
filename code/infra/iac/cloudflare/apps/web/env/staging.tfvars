# web · staging. Fill account_id + zone_id + domain (the zone must be on this CF account).
env               = "staging"
worker_name       = "indiecrafts-web-staging"
attach_domain     = true
account_id        = ""                     # REQUIRED
zone_id           = ""                     # REQUIRED (the domain's zone)
domain            = "staging.example.com"  # REQUIRED — your staging host
turnstile_domains = ["staging.example.com"]
