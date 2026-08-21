# api · dev. Runs on *.workers.dev — no custom domain, so the zone-scoped WAF/rate-limit
# resources stay inert (the inline guard in src/index.ts protects the Worker regardless).
# `project:rename <slug>` rewrites `worker_name` like it does the wrangler names.
env           = "dev"
worker_name   = "indiecrafts-dev-shared-api"
attach_domain = false # dev runs on *.workers.dev — no custom domain
account_id    = ""    # REQUIRED
zone_id       = ""    # only needed when attach_domain = true
domain        = ""

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
