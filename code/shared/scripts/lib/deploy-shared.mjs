// Tiny helpers shared by every deploy runner (deploy-next · deploy-worker).

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";

/** Run a command, inheriting stdio; exit the process on a non-zero status. */
export function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

/** Interactive prod guard — a hand-run prod action confirms; CI + `--yes` skip it.
 *  Reused by deploy AND db:migrate/db:backup:
 *    confirmProd("Deploy", app, env, { yes }) · confirmProd("Migrate", db, env, { yes }). */
export async function confirmProd(action, target, env, { yes } = {}) {
  if (env !== "prod" || yes || process.env.CI) return;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((res) =>
    rl.question(`⚠  ${action} ${target} in PRODUCTION? [y/N] `, res),
  );
  rl.close();
  if (!/^y(es)?$/i.test(ans.trim())) {
    console.log("Aborted.");
    process.exit(0);
  }
}
