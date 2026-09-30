# web · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
env               = "prod"
worker_name       = "indiecrafts-prod-web-surfaces-website"
attach_domain     = true
account_id        = ""            # REQUIRED
zone_id           = ""            # REQUIRED (the domain's zone)
domain            = "example.com" # REQUIRED — your production host
turnstile_domains = ["example.com", "www.example.com"]

# Optional edge tunables — module defaults (uncomment here AND in main.tf to override):
# rate_limit_requests      = 20
# rate_limit_period        = 60
# rate_limit_form_requests = 10    # tighter cap on the form/report endpoints
# enable_managed_waf       = true
# enable_bot_fight         = true
# block_bad_bots           = false # managed-challenge scraper UAs on content routes (public site: keep off unless scraped)
# enable_cache_rules       = true
# enable_tiered_cache      = true
