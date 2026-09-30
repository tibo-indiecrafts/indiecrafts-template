// Tiny helpers shared by every deploy runner (deploy-next · deploy-worker · deploy-all).

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";

/** Run a command, inheriting stdio; exit the process on a non-zero status. */
export function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ── deploy-gate decisions (pure; exported for tests) ──
// The pre-deploy `pnpm verify` gate is TIERED: `dev` is the fast shared sandbox and CI is
// already gated by the CI workflow, so both skip; a hand-run staging/prod deploy runs it.
export const gateSkipped = (env, { skipGate, ci = process.env.CI } = {}) =>
  env === "dev" || Boolean(ci) || Boolean(skipGate);
// The prod confirm prompt skips for non-prod, in CI, or when explicitly acked. A bare `--yes`
// (delegate calls: migrate/secrets) still skips; the top-level deploy passes `yesProd` only.
export const confirmSkipped = (
  env,
  { yes, yesProd, ci = process.env.CI } = {},
) => env !== "prod" || Boolean(ci) || Boolean(yes) || Boolean(yesProd);

/** Pre-deploy quality gate for a HAND-RUN staging/prod deploy — runs the full `pnpm verify`
 *  (tsc · lint · format · tests · guards) so an unverified working tree never ships.
 *  `--skip-gate` opts out for a genuine hotfix (logged loudly). */
export function gate(env, { skipGate } = {}) {
  if (gateSkipped(env, { skipGate })) {
    if (skipGate && env !== "dev" && !process.env.CI)
      console.warn(
        `⚠  --skip-gate: shipping to ${env} WITHOUT \`pnpm verify\`. You own the risk.`,
      );
    return;
  }
  console.log(
    `▸ Pre-deploy gate: \`pnpm verify\` for ${env} — tsc · lint · tests · guards…`,
  );
  run("pnpm", ["-w", "run", "verify"]);
}

/** Interactive prod guard — a hand-run prod action confirms. Reused by deploy AND
 *  db:migrate/db:backup. `--yes` skips it for the DELEGATE calls (migrate/secrets, already
 *  confirmed at the top); the top-level deploy passes `{ yesProd }`, so a bare `--yes` no
 *  longer skips a prod DEPLOY — an intentional non-interactive prod deploy needs `--yes-prod`.
 *  CI skips it (the prod GitHub Environment's required reviewer is the CI-side gate). */
export async function confirmProd(action, target, env, { yes, yesProd } = {}) {
  if (confirmSkipped(env, { yes, yesProd })) return;
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

/** `wrangler deploy` args that stamp the build into the Worker (read by the api's /health). */
export const buildVarArgs = (version, commit) => [
  "--var",
  `BUILD_VERSION:${version}`,
  "--var",
  `BUILD_COMMIT:${commit}`,
];
