// Rename the project's namespace in ONE command — for reusing this template per
// client. Rewrites `DEFAULT_SITE_PREFIX` (config) + the `<prefix>-web*` resource
// names in `wrangler.toml` + `worker_name` in the Terraform tfvars, then prints the
// R2 buckets to create. Run from `code/projects/web/surfaces/website`:
//
//   pnpm project:rename <slug>      # e.g. acme  →  DEFAULT_SITE_PREFIX="acme", worker "acme-web"
//
// The slug is the per-client namespace: it prefixes browser keys (consent/theme/
// locale) AND the Cloudflare Worker/R2 names, so two clients under one account
// never collide. Must be unique per client.

import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { TEMPLATE_SLUG } from "../../../../../shared/scripts/lib/project.mjs";

const slug = process.argv[2];
if (!slug || !/^[a-z][a-z0-9-]{2,40}$/.test(slug)) {
  console.error(
    "Usage: project:rename <slug>   (lowercase, a-z 0-9 -, 3–41 chars, starts with a letter)",
  );
  process.exit(1);
}
if (slug === "indiecrafts") {
  console.error(
    "✗ 'indiecrafts' is the template default — pick a slug unique to this client.",
  );
  process.exit(1);
}

const CONFIG_INDEX = resolve("../../../../../packages/shared/config/src/index.ts");
const WRANGLER = resolve("wrangler.toml");
const newStem = `${slug}-web`; // wrangler resource stem = <prefix>-web

// 1. Config: DEFAULT_SITE_PREFIX = "indiecrafts" → "<slug>"
const config = readFileSync(CONFIG_INDEX, "utf8");
const nextConfig = config.replace(/(DEFAULT_SITE_PREFIX\s*=\s*)"[^"]*"/, `$1"${slug}"`);
if (nextConfig === config) {
  console.error(
    "✗ Could not find DEFAULT_SITE_PREFIX in @indiecrafts/config — aborting (nothing changed).",
  );
  process.exit(1);
}
writeFileSync(CONFIG_INDEX, nextConfig);

// 2. wrangler.toml: rewrite the "<TEMPLATE_SLUG>" stem ONLY on resource-name lines
//    (name / bucket_name / database_name) — comments + docs are left untouched.
const wrangler = readFileSync(WRANGLER, "utf8");
const nextWrangler = wrangler
  .split("\n")
  .map((line) =>
    /^\s*(name|bucket_name|database_name)\s*=/.test(line)
      ? line.replaceAll(TEMPLATE_SLUG, newStem)
      : line,
  )
  .join("\n");
writeFileSync(WRANGLER, nextWrangler);

// 2b. Other apps (api, cron, workers, …): rename each app's own wrangler.toml stem
//     `indiecrafts-<app>` → `<slug>-<app>` on resource-name lines (+ its tfvars, if
//     any). Same clobber guard applies — a worker won't deploy to staging/prod until
//     renamed. Discovered from `code/projects/*/wrangler.toml`, so new apps are covered
//     with no edit here.
const APPS_DIR = resolve("..");
const renamedApps = [];
for (const app of readdirSync(APPS_DIR, { withFileTypes: true })) {
  if (!app.isDirectory() || app.name === "web") continue;
  const appWrangler = `${APPS_DIR}/${app.name}/wrangler.toml`;
  if (!existsSync(appWrangler)) continue;
  const stem = `${TEMPLATE_SLUG.replace(/-web$/, "")}-${app.name}`; // indiecrafts-<app>
  const newAppStem = `${slug}-${app.name}`;
  const src = readFileSync(appWrangler, "utf8");
  const out = src
    .split("\n")
    .map((line) =>
      /^\s*(name|bucket_name|database_name)\s*=/.test(line)
        ? line.replaceAll(stem, newAppStem)
        : line,
    )
    .join("\n");
  if (out !== src) {
    writeFileSync(appWrangler, out);
    renamedApps.push(app.name);
  }
  const appTfvars = resolve(`../${app.name}/infra/cloudflare/env`); // co-located per-app Terraform
  for (const env of ["dev", "staging", "prod"]) {
    const file = `${appTfvars}/${env}.tfvars`;
    if (!existsSync(file)) continue;
    const tf = readFileSync(file, "utf8");
    const nextTf = tf
      .split("\n")
      .map((line) =>
        /^\s*worker_name\s*=/.test(line) ? line.replaceAll(stem, newAppStem) : line,
      )
      .join("\n");
    if (nextTf !== tf) writeFileSync(file, nextTf);
  }
}

// 3. Terraform tfvars: rewrite `worker_name` so the IaC targets the renamed Worker
//    (else Terraform would manage a dead worker). Only the `worker_name` line; the
//    infra layer is optional, so skip silently if the dir is absent.
const TFVARS_DIR = resolve("infra/cloudflare/env"); // web's co-located Terraform (code/projects/web/surfaces/website/infra/cloudflare/env)
let tfvarsCount = 0;
for (const env of ["dev", "staging", "prod"]) {
  const file = `${TFVARS_DIR}/${env}.tfvars`;
  if (!existsSync(file)) continue;
  const tf = readFileSync(file, "utf8");
  const nextTf = tf
    .split("\n")
    .map((line) =>
      /^\s*worker_name\s*=/.test(line) ? line.replaceAll(TEMPLATE_SLUG, newStem) : line,
    )
    .join("\n");
  if (nextTf !== tf) {
    writeFileSync(file, nextTf);
    tfvarsCount++;
  }
}

console.log(`✓ Renamed project namespace → "${slug}"`);
console.log(`  · @indiecrafts/config  DEFAULT_SITE_PREFIX = "${slug}"`);
console.log(`  · wrangler.toml         Worker/R2 stem = "${newStem}"`);
if (renamedApps.length)
  console.log(
    `  · other apps            ${renamedApps.map((a) => `"${slug}-${a}"`).join(", ")}`,
  );
if (tfvarsCount)
  console.log(
    `  · Terraform tfvars      worker_name → "${newStem}*" (${tfvarsCount} env${tfvarsCount > 1 ? "s" : ""})`,
  );
console.log("\nNext:");
console.log("  1. Create the R2 buckets (one per env):");
for (const env of ["dev", "staging", "prod"]) {
  console.log(`       wrangler r2 bucket create ${newStem}-isr-${env}`);
  console.log(`       wrangler r2 bucket create ${newStem}-backups-${env}`);
}
console.log(
  "  2. Set NEXT_PUBLIC_SITE_PREFIX in your env only if it must differ from the config default.",
);
console.log("  3. pnpm verify:quick  →  commit.");
