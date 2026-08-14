// Build (version stamp → OpenNext) + deploy the Worker to one env. A hand-run
// prod deploy asks for confirmation; CI (GitHub Actions sets CI=true) and `--yes`
// skip the prompt. Invoked by deploy:web:<env>.
//
//   node scripts/deploy.mjs <dev|staging|prod> [--yes]

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { assertRenamed } from "./lib/project.mjs";

const env = process.argv[2];
const yes = process.argv.includes("--yes");
if (!["dev", "staging", "prod"].includes(env)) {
  console.error("Usage: deploy.mjs <dev|staging|prod> [--yes]");
  process.exit(1);
}

// Refuse a staging/prod deploy while the Worker/R2 names are still the template
// default — a shared Cloudflare account would clobber another client.
assertRenamed(env);

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function confirmProd() {
  if (env !== "prod" || yes || process.env.CI) return;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((res) =>
    rl.question("Deploy to PRODUCTION? [y/N] ", res),
  );
  rl.close();
  if (!/^y(es)?$/i.test(ans.trim())) {
    console.log("Aborted.");
    process.exit(0);
  }
}

await confirmProd();
run("node", ["scripts/version.mjs"]);
run("opennextjs-cloudflare", ["build"]);
run("wrangler", ["deploy", "--env", env]);
console.log(`✓ Deployed to ${env}.`);
