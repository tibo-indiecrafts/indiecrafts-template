# storybook · dev. Runs on *.workers.dev — no custom domain, so the zone-scoped
# hardening + cache resources stay inert. `project:rename <slug>` rewrites `worker_name`.
env           = "dev"
worker_name   = "indiecrafts-dev-web-tools-storybook"
attach_domain = false
account_id    = "" # REQUIRED
zone_id       = "" # only needed when attach_domain = true
domain        = ""
