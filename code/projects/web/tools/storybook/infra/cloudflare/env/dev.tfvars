# storybook · dev. Runs on *.workers.dev — no custom domain, so the zone-scoped
# hardening + cache resources stay inert. `project:rename <slug>` rewrites `worker_name`.
env           = "dev"
worker_name   = "indiecrafts-dev-web-tools-storybook"
attach_domain = false
account_id    = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account (the one every Worker deploys to)
zone_id       = ""                                 # only needed when attach_domain = true
domain        = ""
