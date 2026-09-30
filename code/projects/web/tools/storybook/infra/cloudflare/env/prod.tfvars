# storybook · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
env           = "prod"
worker_name   = "indiecrafts-prod-web-tools-storybook"
attach_domain = true
account_id    = "98ca87410b95e03a60f646d95e154266" # this Cloudflare account (the one every Worker deploys to)
zone_id       = ""                                 # REQUIRED (the domain's zone)
domain        = "storybook.example.com"            # REQUIRED — your production host
manage_zone   = false                              # a subdomain of the website zone — the prod website stack owns its zone-wide rules
