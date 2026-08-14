# web · prod. Fill account_id + zone_id + domain (the zone must be on this CF account).
env               = "prod"
worker_name       = "indiecrafts-web"
attach_domain     = true
account_id        = ""              # REQUIRED
zone_id           = ""              # REQUIRED (the domain's zone)
domain            = "example.com"   # REQUIRED — your production host
turnstile_domains = ["example.com", "www.example.com"]
