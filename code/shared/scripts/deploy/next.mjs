// Deploy a Next.js app (OpenNext → Cloudflare Workers: web · marketing · admin) to
// one env. Shared by every `next-cf` slot — invoked from the app dir via its
// `deploy:<app>:<env>` script, so `build:cf` + `wrangler.toml` resolve against that
// app. Runs the app's OWN `build:cf` (web's stamps a version; others just build),
// then `wrangler deploy`. Prod asks to confirm; CI (CI=true) and `--yes` skip it.
//
//   node ../../../scripts/deploy-next.mjs <app> <dev|staging|prod> [--yes]

import { assertRenamed } from "../lib/project.mjs";
import { run, confirmProd } from "../lib/deploy-shared.mjs";
import { ENVS } from "../lib/apps.mjs";
import { originFor } from "../lib/domains.mjs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
if (!app || !ENVS.includes(env)) {
  console.error("Usage: deploy-next.mjs <app> <dev|staging|prod> [--yes]");
  process.exit(1);
}

// Refuse a staging/prod deploy while the Worker/R2 names are still the template
// default — a shared Cloudflare account would clobber another client.
assertRenamed(app, env);
await confirmProd("Deploy", app, env, { yes });

// Runtime origin comes from the domain registry (single source of truth) — set it
// for the build unless the env already provides one. No-op until a real host is set.
const origin = originFor(app, env);
if (origin && !process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = origin;
  console.log(`↪ NEXT_PUBLIC_SITE_URL=${origin} (from the domain registry)`);
}

run("pnpm", ["run", "build:cf"]); // per-app build recipe (web: version stamp + OpenNext)
run("wrangler", ["deploy", "--env", env]);
console.log(`✓ Deployed ${app} to ${env}.`);
