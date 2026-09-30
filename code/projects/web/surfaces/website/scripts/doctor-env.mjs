/**
 * Validate .env.local before dev, seed, or content operations.
 *
 * @see docs/reference/projects/web/website/scripts/doctor-env.md
 */
// Preflight: validate .env.local before dev / seed / content ops. Reads the file
// itself (not --env-file) so a MISSING file is reported clearly, not a crash.
//
//   pnpm doctor:web:website:env            # check the base config
//   pnpm doctor:web:website:env -- --for=seed   # also require the write token
//
// Exits 1 on a missing required key; warns (exit 0) on missing optional ones.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getWranglerSlug,
  readSitePrefix,
} from "../../../../../shared/scripts/lib/project.mjs";

const forSeed = process.argv.includes("--for=seed");
const envPath = resolve(".env.local");

let env = {};
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
} catch {
  console.error(`✗ No .env.local at ${envPath}`);
  console.error(
    "  Copy .env.example → .env.local and fill in your Sanity project values.",
  );
  process.exit(1);
}

const isSet = (k) => env[k] && !/_here$|^your_/i.test(env[k]);

// [key, requiredAlways, hint]
const REQUIRED = [
  ["NEXT_PUBLIC_SANITY_PROJECT_ID", true, "Sanity project id — sanity.io/manage → API"],
  ["NEXT_PUBLIC_SANITY_DATASET", true, "usually 'production'"],
  ["NEXT_PUBLIC_SANITY_API_VERSION", true, "pinned date, e.g. 2025-01-01"],
];
const RECOMMENDED = [
  ["NEXT_PUBLIC_SITE_URL", "canonical URLs / sitemap / OG — required for production"],
  ["SANITY_API_READ_TOKEN", "draft-mode preview + live blog queries"],
  ["SANITY_API_WRITE_TOKEN", "pnpm seed + runtime writes (comments, newsletter→sanity)"],
];

const missing = [];
const warn = [];

for (const [key, , hint] of REQUIRED) {
  if (!isSet(key)) missing.push(`${key} — ${hint}`);
}
for (const [key, hint] of RECOMMENDED) {
  if (!isSet(key)) warn.push(`${key} — ${hint}`);
}
if (forSeed && !isSet("SANITY_API_WRITE_TOKEN")) {
  missing.push("SANITY_API_WRITE_TOKEN — required for `pnpm seed` (Editor role)");
}

if (warn.length) {
  console.log("⚠ Optional keys not set (fine for a basic dev run):");
  for (const w of warn) console.log(`  · ${w}`);
}
if (missing.length) {
  console.error("\n✗ Missing required env in .env.local:");
  for (const m of missing) console.error(`  · ${m}`);
  console.error("\n  Fill them in .env.local (see .env.example), then re-run.");
  process.exit(1);
}

// ── Site identity — the four scattered per-client values, seen at once ──
const prefix = readSitePrefix();
const slug = getWranglerSlug();
console.log("\nSite identity (unique per client):");
console.log(`  · prefix (namespace)   ${prefix}`);
console.log(`  · deploy slug (worker) ${slug}`);
console.log(
  `  · Sanity project       ${env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "—"} / ${env.NEXT_PUBLIC_SANITY_DATASET ?? "—"}`,
);
console.log(`  · site url             ${env.NEXT_PUBLIC_SITE_URL || "(placeholder)"}`);

// Drift: Worker names are `<prefix>-<env>-<platform path>` (`resourceName` in apps.mjs), and
// the prefix is their only client-specific part — so the Worker must start with `<prefix>-`.
if (!slug.startsWith(`${prefix}-`)) {
  console.log(
    `\n⚠ Prefix/deploy drift: prefix is "${prefix}" but the Worker is "${slug}" (expected "${prefix}-…").` +
      `\n  Run  pnpm project:rename <client-slug>  to re-sync both, or align NEXT_PUBLIC_SITE_PREFIX.`,
  );
}

// Shared-Sanity-project model: a per-client dataset is required, not "production".
if (
  env.SANITY_SHARED_PROJECT === "true" &&
  env.NEXT_PUBLIC_SANITY_DATASET === "production"
) {
  console.log(
    "\n⚠ SANITY_SHARED_PROJECT=true with dataset 'production' — clients on one project share this dataset." +
      "\n  Use a per-client dataset (e.g. 'acme-prod') so content doesn't collide.",
  );
}

console.log("\n✓ Env looks good.");
