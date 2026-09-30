# api · staging — same as dev: serves on *.workers.dev, no custom domain
# (attach_domain = false). Only prod gets a custom domain (updates.indiecrafts.dev).
env           = "staging"
worker_name   = "indiecrafts-staging-shared-api"
attach_domain = false
account_id    = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account
zone_id       = ""                                 # unused while attach_domain = false
domain        = ""                                 # unused — staging stays on *.workers.dev

# Optional edge tunables — main.tf defaults (uncomment here to override):
# rate_limit_requests       = 60
# rate_limit_period         = 60
# enable_managed_waf        = true
# enable_bot_fight          = true
# enable_leaked_credentials = true
