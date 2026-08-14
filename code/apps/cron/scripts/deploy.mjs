// Deploy the cron Worker to one env. A bare worker — `wrangler deploy` bundles
// src/index.ts + its imports (no OpenNext build, unlike the web app). Prod asks to
// confirm; CI (CI=true) and `--yes` skip it. Invoked by deploy:cron:<env>.
//
//   node scripts/deploy.mjs <dev|staging|prod> [--yes]

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";

const env = process.argv[2];
const yes = process.argv.includes("--yes");
if (!["dev", "staging", "prod"].includes(env)) {
  console.error("Usage: deploy.mjs <dev|staging|prod> [--yes]");
  process.exit(1);
}

// Shared-account clobber guard: refuse a staging/prod deploy while the Worker name
// is still the template default — a shared Cloudflare account would clobber another
// client. `pnpm project:rename <slug>` rewrites it. dev is the shared sandbox.
if (env !== "dev" && readFileSync("wrangler.toml", "utf8").includes("indiecrafts-cron-")) {
  console.error(
    "✗ Rename first: `pnpm project:rename <slug>` (staging/prod is blocked on the template-default name).",
  );
  process.exit(1);
}

if (env === "prod" && !yes && !process.env.CI) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((res) => rl.question("Deploy cron to PRODUCTION? [y/N] ", res));
  rl.close();
  if (!/^y(es)?$/i.test(ans.trim())) {
    console.log("Aborted.");
    process.exit(0);
  }
}

const r = spawnSync("wrangler", ["deploy", "--env", env], { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`✓ Deployed cron to ${env}.`);
