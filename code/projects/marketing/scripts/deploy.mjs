// Build (OpenNext) + deploy the marketing Worker to one env. Prod asks to confirm;
// CI (CI=true) and `--yes` skip it. Invoked by deploy:marketing:<env>.
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

// Shared-account clobber guard — refuse staging/prod on the template-default name.
if (env !== "dev" && readFileSync("wrangler.toml", "utf8").includes("indiecrafts-marketing-")) {
  console.error("✗ Rename first: `pnpm project:rename <slug>` (staging/prod blocked on the template name).");
  process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (env === "prod" && !yes && !process.env.CI) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((res) => rl.question("Deploy marketing to PRODUCTION? [y/N] ", res));
  rl.close();
  if (!/^y(es)?$/i.test(ans.trim())) {
    console.log("Aborted.");
    process.exit(0);
  }
}

run("opennextjs-cloudflare", ["build"]);
run("wrangler", ["deploy", "--env", env]);
console.log(`✓ Deployed marketing to ${env}.`);
