# storybook · staging. Fill account_id + zone_id + domain (the zone must be on this CF account).
env           = "staging"
worker_name   = "indiecrafts-staging-web-tools-storybook"
attach_domain = true
account_id    = ""                              # REQUIRED
zone_id       = ""                              # REQUIRED (the domain's zone)
domain        = "storybook-staging.example.com" # REQUIRED — your staging host
