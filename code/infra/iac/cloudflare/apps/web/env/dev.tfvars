# web · dev. Fill account_id (dashboard → your account). `project:rename <slug>`
# rewrites `worker_name` like it does the wrangler names.
env               = "dev"
worker_name       = "indiecrafts-web-dev"
attach_domain     = false # dev runs on *.workers.dev — no custom domain
account_id        = ""    # REQUIRED
zone_id           = ""    # only needed when attach_domain = true
domain            = ""
turnstile_domains = ["localhost"]
