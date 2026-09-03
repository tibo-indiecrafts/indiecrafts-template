# storybook · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
env           = "prod"
worker_name   = "indiecrafts-prod-web-tools-storybook"
attach_domain = true
account_id    = ""                      # REQUIRED
zone_id       = ""                      # REQUIRED (the domain's zone)
domain        = "storybook.example.com" # REQUIRED — your production host
