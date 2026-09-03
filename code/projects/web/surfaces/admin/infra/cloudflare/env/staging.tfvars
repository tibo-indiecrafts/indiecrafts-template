# admin · staging. Fill account_id + zone_id + domain (the zone must be on this CF account).
# admin is SSO-gated via Cloudflare Zero Trust Access — set access_email_domain below.
env                 = "staging"
worker_name         = "indiecrafts-staging-web-surfaces-admin"
attach_domain       = true
account_id          = ""                          # REQUIRED
zone_id             = ""                          # REQUIRED (the domain's zone)
domain              = "admin-staging.example.com" # REQUIRED — your staging host
turnstile_domains   = ["admin-staging.example.com"]
access_email_domain = "your-company.com" # REQUIRED — SSO-allowed email domain (Cloudflare Zero Trust Access)

# Optional edge tunables — module defaults (uncomment here AND in main.tf to override):
# rate_limit_requests      = 20
# rate_limit_period        = 60
# rate_limit_form_requests = 10    # tighter cap on the form/report endpoints
# enable_managed_waf       = true
# enable_bot_fight         = true
# block_bad_bots           = false # managed-challenge scraper UAs on content routes
# enable_cache_rules       = true
# enable_tiered_cache      = true
