# web · dev. Fill account_id (dashboard → your account). `project:rename <slug>`
# rewrites `worker_name` like it does the wrangler names.
env               = "dev"
worker_name       = "indiecrafts-dev-web-website"
attach_domain     = false # dev runs on *.workers.dev — no custom domain
account_id        = ""    # REQUIRED
zone_id           = ""    # only needed when attach_domain = true
domain            = ""
turnstile_domains = ["localhost"]

# Optional edge tunables — module defaults (uncomment here AND in main.tf to override).
# Dev often relaxes these (e.g. a looser rate limit, WAF off) — set per taste:
# rate_limit_requests = 20
# rate_limit_period   = 60
# enable_managed_waf  = true
# enable_bot_fight    = true
# enable_cache_rules  = true
# enable_tiered_cache = true
