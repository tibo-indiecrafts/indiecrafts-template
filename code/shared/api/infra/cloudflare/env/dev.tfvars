# api · dev. Runs on *.workers.dev — no custom domain, so the zone-scoped WAF/rate-limit
# resources stay inert (the inline guard in src/index.ts protects the Worker regardless).
# `project:rename <slug>` rewrites `worker_name` like it does the wrangler names.
env           = "dev"
worker_name   = "indiecrafts-dev-shared-api"
attach_domain = false                              # dev runs on *.workers.dev — no custom domain
account_id    = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account
zone_id       = ""                                 # unused while attach_domain = false
domain        = ""                                 # unused — dev stays on *.workers.dev

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
