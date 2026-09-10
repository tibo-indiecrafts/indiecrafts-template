# infra — per-app Cloudflare Terraform · deploy · CI

Infrastructure for the platform. There is **no central `code/infra/` folder** — infra is split by
concern, close to what it configures:

- **Edge IaC (Terraform)** — **co-located + self-contained** at `code/projects/<platform>/<kind>/<app>/infra/` (one
  `main.tf` with the provider + vars + all edge resources + outputs, plus per-env tfvars). DNS · WAF ·
  rate-limit · cache · Turnstile, per app × per env. Run: `pnpm infra:<app>:{init,plan,apply,output}:<env>`.
  Full runbook → [Cloudflare as code](/infra/cloudflare-iac).
- **Deploy machinery** — `scripts/`: the app registry (`code/shared/scripts/lib/apps.mjs`) + the class-dispatched
  runners (`deploy-next` · `deploy-worker` · `deploy-expo`). Model →
  [Platform deploy](/shared/architecture/platform-deploy).
- **CI** — `.github/workflows/`: build · deploy · preview fan out from the registry; backup is hub-scoped.

## Key conventions

- **Secrets never land in git.** Only `.env.example` is committed; real values live in the host's env
  store (Cloudflare Workers → Variables & Secrets, or `wrangler secret put`; GitHub Environments for CI).
- **Never a token under `NEXT_PUBLIC_`.** That prefix ships to the browser — it can never hold a secret.
- **dev · staging · prod parity.** Same variables everywhere; only the values change.
- **The staging gate:** `NEXT_PUBLIC_SITE_URL` unset → `robots.ts` serves `Disallow: /`, so a preview
  env can't get indexed.
- **Per-env asset CDN (optional):** set `NEXT_PUBLIC_CDN_URL` per env → Next `assetPrefix` serves the
  app's own `/_next/*` + `/public` assets from a CDN. Sanity content keeps its own CDN. See
  [images](/apps/web/config/images).

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Cloudflare dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
