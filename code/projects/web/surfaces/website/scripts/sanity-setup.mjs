#!/usr/bin/env node
/**
 * One-time Sanity project setup — safe to re-run; it only adds what is missing.
 *
 *   pnpm sanity:setup              # apply
 *   pnpm sanity:setup -- --dry-run # print the plan only
 *
 * Needs a `sanity login` session (dataset and CORS changes need project-admin rights;
 * a content token cannot) and `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.
 *
 *   1. Datasets — creates the content dataset (`NEXT_PUBLIC_SANITY_DATASET`) and the
 *      throwaway `tests-e2e` dataset the browser journeys seed. Asked private; Sanity's free
 *      plan makes them public (2 datasets, public only) — see `setup/new-client.md`.
 *   2. CORS — allows every website origin (`scripts/lib/site-origins.mjs`: each env,
 *      prod first, + localhost:3000) with credentials, for the Studio and the preview.
 *   3. Checks the api worker reads the same project (`code/shared/api/wrangler.toml`).
 *
 * Tokens, the publish webhook and the hosted Studio stay manual (secrets, or a
 * browser step): the script prints them at the end.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { siteOrigins } from "./lib/site-origins.mjs";

const E2E_DATASET = "tests-e2e";
const FREE_PLAN_DATASETS = 2;
const APP_DIR = fileURLToPath(new URL("..", import.meta.url));
const API_TOML = fileURLToPath(
  new URL("../../../../../shared/api/wrangler.toml", import.meta.url),
);

/** The CLI's list output → one entry per line (colours and blank lines removed). Pure. */
export function listLines(stdout) {
  return stdout
    .replace(/\x1b\[[0-9;]*m/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * What to add: missing datasets and missing CORS origins, plus warnings. Pure.
 * `datasets` / `origins` are what the project has now.
 */
export function plan({ datasets, origins, wanted }) {
  const missingDatasets = wanted.datasets.filter((d) => !datasets.includes(d));
  const warnings = [];
  if (datasets.length + missingDatasets.length > FREE_PLAN_DATASETS) {
    warnings.push(
      `The project would hold ${datasets.length + missingDatasets.length} datasets; ` +
        `Sanity's free plan allows ${FREE_PLAN_DATASETS}. A create past the limit fails.`,
    );
  }
  return {
    missingDatasets,
    missingOrigins: wanted.origins.filter((o) => !origins.includes(o)),
    warnings,
  };
}

/** The `SANITY_PROJECT_ID` values in the api worker's `wrangler.toml`. Pure. */
export function apiProjectIds(toml) {
  return [...toml.matchAll(/^\s*SANITY_PROJECT_ID\s*=\s*"([^"]*)"/gm)].map((m) => m[1]);
}

function sanity(...args) {
  const r = spawnSync("pnpm", ["exec", "sanity", ...args], {
    cwd: APP_DIR,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    throw new Error(`sanity ${args.join(" ")} failed:\n${r.stderr || r.stdout}`);
  }
  return r.stdout;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  if (!projectId) {
    console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local.");
    process.exit(1);
  }

  let datasets;
  try {
    datasets = listLines(sanity("dataset", "list"));
  } catch (err) {
    console.error(`✗ ${err.message}`);
    console.error(
      "  Log in first: pnpm --filter @indiecrafts/web-surfaces-website exec sanity login",
    );
    process.exit(1);
  }
  const origins = listLines(sanity("cors", "list"));
  const wanted = {
    datasets: [...new Set([dataset, E2E_DATASET])],
    origins: siteOrigins(),
  };
  const { missingDatasets, missingOrigins, warnings } = plan({
    datasets,
    origins,
    wanted,
  });

  console.log(`Sanity project ${projectId}`);
  console.log(`  datasets: ${datasets.join(", ") || "(none)"}`);
  for (const w of warnings) console.log(`  ! ${w}`);
  for (const d of missingDatasets) {
    console.log(`  + dataset ${d}`);
    if (!dryRun) sanity("dataset", "create", d, "--visibility", "private");
  }
  for (const o of missingOrigins) {
    console.log(`  + CORS origin ${o} (credentials)`);
    if (!dryRun) sanity("cors", "add", o, "--credentials");
  }
  if (!missingDatasets.length && !missingOrigins.length)
    console.log("  ✓ datasets and CORS origins are set");

  const apiIds = apiProjectIds(readFileSync(API_TOML, "utf8"));
  const stale = apiIds.filter((id) => id !== projectId);
  if (stale.length) {
    console.log(
      `  ! code/shared/api/wrangler.toml reads project ${[...new Set(stale)].join(", ")}: ` +
        `set SANITY_PROJECT_ID = "${projectId}" in each env.`,
    );
  }
  if (dryRun) console.log("Dry run — nothing changed.");

  console.log(`
Manual steps (setup/new-client.md §4):
  - Tokens: a Viewer → SANITY_API_READ_TOKEN (website AND code/shared/api), an Editor →
    SANITY_API_WRITE_TOKEN (website + api):
      pnpm --filter @indiecrafts/web-surfaces-website exec sanity tokens add "Viewer" --role viewer
  - Content: pnpm seed (baseline, into the empty dataset)
  - Hosted Studio: pnpm --filter @indiecrafts/web-surfaces-website studio:deploy, then add the
    printed app id to STUDIO_APP_IDS in sanity.cli.ts and set NEXT_PUBLIC_SANITY_STUDIO_URL
  - Publish webhook → <site>/api/revalidate (setup/launch-checklist.md §3)`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
