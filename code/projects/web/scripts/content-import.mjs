// Import a Sanity dataset backup (the CMS analog of a DB restore). DESTRUCTIVE:
// `--replace` overwrites documents with the same _id in the target dataset.
//
//   pnpm content:import -- <file.tar.gz>              # into NEXT_PUBLIC_SANITY_DATASET
//   pnpm content:import -- <file.tar.gz> --dataset X  # into a specific dataset
//   pnpm content:import -- <file.tar.gz> --yes        # skip the typed confirmation
//
// Needs SANITY_API_WRITE_TOKEN (Editor). Prefer importing into a scratch dataset first.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const yes = args.includes("--yes");
const dsFlag = args.indexOf("--dataset");
const dataset = dsFlag !== -1 ? args[dsFlag + 1] : process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!file || !existsSync(file)) {
  console.error("✗ Pass a backup file: pnpm content:import -- <file.tar.gz>");
  process.exit(1);
}
if (!projectId || !dataset) {
  console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID / dataset. See .env.example.");
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN (Editor role) — required to import.");
  process.exit(1);
}

function run() {
  console.log(`Importing ${file} → ${projectId}/${dataset} (--replace)`);
  const res = spawnSync("sanity", ["dataset", "import", file, dataset, "--replace"], {
    stdio: "inherit",
    env: { ...process.env, SANITY_AUTH_TOKEN: token },
  });
  if (res.status !== 0) {
    console.error("✗ Import failed.");
    process.exit(res.status ?? 1);
  }
  console.log("✓ Import complete. Verify content in the Studio.");
}

if (yes) {
  run();
} else {
  console.log(`\n⚠ This OVERWRITES documents in "${dataset}". Prefer a scratch dataset.`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`Type the dataset name "${dataset}" to proceed: `, (answer) => {
    rl.close();
    if (answer.trim() !== dataset) {
      console.error("✗ Aborted.");
      process.exit(1);
    }
    run();
  });
}
