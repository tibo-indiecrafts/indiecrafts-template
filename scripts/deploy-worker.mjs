// Deploy a BARE Cloudflare Worker app (api · cron · workers) to one env. Shared by
// every worker slot — invoked from the app dir via its `deploy:<app>:<env>` script,
// so `wrangler.toml` + `wrangler deploy` resolve against that app. A bare worker:
// `wrangler deploy` bundles src/index.ts + its imports (no OpenNext build, unlike
// the web app, which keeps its own scripts/deploy.mjs). Prod asks to confirm; CI
// (CI=true) and `--yes` skip it.
//
//   node ../../../scripts/deploy-worker.mjs <app> <dev|staging|prod> [--yes]

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
if (!app || !["dev", "staging", "prod"].includes(env)) {
  console.error("Usage: deploy-worker.mjs <app> <dev|staging|prod> [--yes]");
  process.exit(1);
}

// Shared-account clobber guard: refuse a staging/prod deploy while the Worker name
// is still the template default (`indiecrafts-<app>-…`) — on a shared Cloudflare
// account that would clobber another client. `pnpm project:rename <slug>` rewrites
// it. dev is the shared sandbox, so it is allowed.
if (env !== "dev" && readFileSync("wrangler.toml", "utf8").includes(`indiecrafts-${app}-`)) {
  console.error(
    `✗ Rename first: \`pnpm project:rename <slug>\` (${app} staging/prod is blocked on the template-default name).`,
  );
  process.exit(1);
}

if (env === "prod" && !yes && !process.env.CI) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((res) =>
    rl.question(`Deploy ${app} to PRODUCTION? [y/N] `, res),
  );
  rl.close();
  if (!/^y(es)?$/i.test(ans.trim())) {
    console.log("Aborted.");
    process.exit(0);
  }
}

const r = spawnSync("wrangler", ["deploy", "--env", env], { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`✓ Deployed ${app} to ${env}.`);
