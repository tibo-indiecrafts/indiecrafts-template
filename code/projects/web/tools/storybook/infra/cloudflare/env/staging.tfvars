# storybook · staging. Runs on *.workers.dev (matches wrangler.toml `[env.staging]
# workers_dev = true`) — no custom domain. Set attach_domain = true + a domain here AND
# switch wrangler's staging off workers.dev if you want a real staging host.
env           = "staging"
worker_name   = "indiecrafts-staging-web-tools-storybook"
attach_domain = false
account_id    = "" # REQUIRED
zone_id       = "" # only needed when attach_domain = true
domain        = ""
