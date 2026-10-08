# admin · staging. Fill account_id + zone_id + domain (the zone must be on this CF account).
# admin is gated by Cloudflare Zero Trust Access — only access_emails (or access_email_domain) pass.
env                 = "staging"
worker_name         = "indiecrafts-staging-web-surfaces-admin"
attach_domain       = true
account_id          = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account (the one every Worker deploys to)
zone_id             = ""                                 # REQUIRED (the domain's zone)
domain              = "admin-staging.example.com"        # REQUIRED — your staging host
manage_zone         = false                              # a subdomain of the website zone — the prod website stack owns its zone-wide rules
turnstile_domains   = ["admin-staging.example.com"]
access_emails       = ["thibault.indiecrafts@gmail.com"] # who may reach the admin (add an admin here)
access_email_domain = ""                                 # optional: allow a whole email domain instead

# Optional edge tunables — module defaults (uncomment here AND in main.tf to override):
# rate_limit_requests      = 20
# rate_limit_period        = 60
# rate_limit_form_requests = 10    # tighter cap on the form/report endpoints
# enable_managed_waf       = true
# enable_bot_fight         = true
# block_bad_bots           = false # managed-challenge scraper UAs on content routes
# enable_cache_rules       = true
# enable_tiered_cache      = true
