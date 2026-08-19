// Deploy a BARE Cloudflare Worker app (api · cron · workers) to one env. Shared by
// every worker slot — invoked from the app dir via its `deploy:<app>:<env>` script,
// so `wrangler.toml` + `wrangler deploy` resolve against that app. A bare worker:
// `wrangler deploy` bundles src/index.ts + its imports (no OpenNext build, unlike a
// Next app, which uses scripts/deploy-next.mjs). Prod asks to confirm; CI (CI=true)
// and `--yes` skip it.
//
//   node ../../../scripts/deploy-worker.mjs <app> <dev|staging|prod> [--yes]

import { assertRenamed } from "../lib/project.mjs";
import { run, confirmProd } from "../lib/deploy-shared.mjs";
import { ENVS } from "../lib/apps.mjs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
if (!app || !ENVS.includes(env)) {
  console.error("Usage: deploy-worker.mjs <app> <dev|staging|prod> [--yes]");
  process.exit(1);
}

// Shared-account clobber guard: refuse a staging/prod deploy while the Worker name
// is still the template default (`indiecrafts-<app>`). `pnpm project:rename <slug>`
// rewrites it. dev is the shared sandbox, so it is allowed.
assertRenamed(app, env);
await confirmProd(app, env, yes);

run("wrangler", ["deploy", "--env", env]);
console.log(`✓ Deployed ${app} to ${env}.`);
