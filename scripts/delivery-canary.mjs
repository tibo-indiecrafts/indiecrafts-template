#!/usr/bin/env node
// Delivery canary — proves `work/` (and other private paths) can NEVER reach a user
// through a real delivery vehicle. `method/` + `work/` live IN the monorepo (tracked),
// so the guard is "not in the DELIVERED artifact," not "not tracked."
//
// It builds the `git archive` export — the clean hand-off's exact file list, which
// honours `.gitattributes export-ignore` — and FAILS if a protected path appears. Run
// in CI on every push (+ folded into `pnpm verify`). When the a-la-carte CLI lands, add
// a check of its `add --dry-run` output tree here too.
//
//   node scripts/delivery-canary.mjs      # exit 1 if the export would leak

import { execSync } from "node:child_process";

const PROTECTED = [
  /^work\//, // the private lab — never delivered
  /^method\//, // internal by default; if you SELL method, drop this + its .gitattributes line
  /(^|\/)\.env(\.|$)/, // .env / .env.local (but keep .env.example)
  /(^|\/)settings\.local\.json$/,
  /(^|\/)scratch\//,
];

// `git archive HEAD` = exactly what a clean export/hand-off would contain (tracked
// files, minus export-ignore). If method/work aren't committed yet, the list simply
// omits them; once they are, export-ignore must keep them out — this asserts it.
let files;
try {
  files = execSync("git archive HEAD | tar -t", {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  })
    .split("\n")
    .filter((f) => f && !f.endsWith("/"));
} catch (err) {
  console.error(`✗ delivery-canary could not build the archive: ${err.message}`);
  process.exit(1);
}

const leaked = files.filter(
  (f) => !f.endsWith(".env.example") && PROTECTED.some((re) => re.test(f)),
);

if (leaked.length) {
  console.error("✗ delivery-canary FAILED — these private paths are in the `git archive` export:");
  for (const f of leaked) console.error(`  ${f}`);
  console.error(
    "\nThe export must never carry `work/`, secrets, or scratch. Add the path to\n" +
      "`.gitattributes` (export-ignore). Never deliver by cloning the repo.",
  );
  process.exit(1);
}
console.log(
  `✓ delivery-canary clean — the git-archive export (${files.length} files) carries no work/ / secrets / scratch.`,
);
