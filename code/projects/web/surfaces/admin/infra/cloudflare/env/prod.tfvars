# admin · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
# admin is SSO-gated via Cloudflare Zero Trust Access — set access_email_domain below.
env                 = "prod"
worker_name         = "indiecrafts-prod-web-surfaces-admin"
attach_domain       = true
account_id          = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account (the one every Worker deploys to)
zone_id             = ""                                 # REQUIRED (the domain's zone)
domain              = "admin.example.com"                # REQUIRED — your production host
manage_zone         = false                              # a subdomain of the website zone — the prod website stack owns its zone-wide rules
turnstile_domains   = ["admin.example.com"]
access_email_domain = "your-company.com" # REQUIRED — SSO-allowed email domain (Cloudflare Zero Trust Access)

# Optional edge tunables — module defaults (uncomment here AND in main.tf to override):
# rate_limit_requests      = 20
# rate_limit_period        = 60
# rate_limit_form_requests = 10    # tighter cap on the form/report endpoints
# enable_managed_waf       = true
# enable_bot_fight         = true
# block_bad_bots           = false # managed-challenge scraper UAs on content routes (public site: keep off unless scraped)
# enable_cache_rules       = true
# enable_tiered_cache      = true
