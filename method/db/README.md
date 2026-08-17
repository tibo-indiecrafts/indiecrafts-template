# Db method

How we design + evolve data (mirrors `code/db`) on **Cloudflare D1** (+ KV for cache):
schema, migrations (forward-only, expand→migrate→contract), seed, Time Travel backups.

- [`database.md`](./database) — D1 bindings, migrations, safe rollout, PII.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Cloudflare dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
