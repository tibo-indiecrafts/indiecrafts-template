// dev:setup — one-shot bootstrap. Takes a fresh clone from "cloned" to "pnpm dev works
// locally and pnpm dev:remote works against the real dev env":
//   1. verify Cloudflare login,
//   2. scaffold each worker's `.dev.vars` from its `.dev.vars.example` (YOU fill the
//      secret VALUES — this never writes them),
//   3. once every `.dev.vars` is filled, deploy every Cloudflare app to dev, which
//      migrates its D1 + deploys + syncs secrets (worker.mjs / next.mjs),
//   4. migrate the LOCAL D1 state `pnpm dev` uses (`pnpm db:migrate:local`).
// If any `.dev.vars` is missing or still on placeholder values it STOPS at step 2 so you
// can fill secrets first, then re-run.
//
//   node code/shared/scripts/dev/setup.mjs

import { existsSync, readFileSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { APPS } from "../lib/apps.mjs";
import { declaredKeys } from "../data/secrets.mjs";
import { run } from "../lib/deploy-shared.mjs";

// Bootstrap targets the shared remote `dev` sandbox (the only env you work against locally).
const workers = APPS.filter((a) => a.class === "worker-cf");

// 1. Login.
const who = spawnSync(
  "pnpm",
  ["--filter", workers[0].pkg, "exec", "wrangler", "whoami"],
  { encoding: "utf8" },
);
if (
  /not authenticated|not logged in|you are not/i.test(
    `${who.stdout ?? ""}${who.stderr ?? ""}`,
  )
) {
  console.error(
    "✗ Not logged in — run  wrangler login  first, then re-run  pnpm dev:setup .",
  );
  process.exit(1);
}

// A declared key is "unfilled" when absent, empty, or still a `your_…` / `…_here`
// placeholder (the same values secrets.mjs skips on sync).
function unfilled(exText, dvText) {
  const need = declaredKeys(exText);
  const vals = new Map();
  for (const line of dvText.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) vals.set(m[1], m[2].trim().replace(/^["']|["']$/g, ""));
  }
  return [...need].filter((k) => {
    const v = vals.get(k);
    return !v || /^your_|_here$/i.test(v);
  });
}

// 2. Scaffold + verify each worker's .dev.vars.
const needFill = [];
for (const w of workers) {
  const ex = resolve(w.dir, ".dev.vars.example");
  const dv = resolve(w.dir, ".dev.vars");
  if (!existsSync(ex) || declaredKeys(readFileSync(ex, "utf8")).size === 0)
    continue;
  if (!existsSync(dv)) {
    copyFileSync(ex, dv);
    console.log(`• scaffolded ${w.dir}/.dev.vars from .dev.vars.example`);
  }
  const gaps = unfilled(readFileSync(ex, "utf8"), readFileSync(dv, "utf8"));
  if (gaps.length) needFill.push({ dir: w.dir, gaps });
}

if (needFill.length) {
  console.log(
    "\n⚠ Fill the secret values in these .dev.vars, then re-run  pnpm dev:setup :",
  );
  for (const { dir, gaps } of needFill)
    console.log(`    ${dir}/.dev.vars   →  ${gaps.join(", ")}`);
  console.log(
    "\n(I scaffold the file from .dev.vars.example but never write secret values.)",
  );
  process.exit(0);
}

// 3. Deploy every Cloudflare app to dev — each migrates its D1 + deploys + syncs secrets.
console.log(
  "\n▶ Deploying all Cloudflare apps to dev (migrate + deploy + secrets)…",
);
run("pnpm", ["deploy:all:dev"]);

// 4. Local dev state — the D1s `pnpm dev` runs on (shared by api, cron and workers).
console.log("\n▶ Migrating the local D1 state for pnpm dev…");
run("pnpm", ["db:migrate:local"]);
console.log(
  "\n✓ Set up. Run  pnpm dev  (local state) or  pnpm dev:remote  (the real dev env).",
);
