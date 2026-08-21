// Rename the project's namespace in ONE command — for reusing this template per
// client. Cloudflare resource names are `<prefix>-<env>-<platform>-<slug>`
// (`resourceName` in apps.mjs), so ONLY `<prefix>` is client-specific: this swaps
// it in `@indiecrafts/packages-shared-config` (`DEFAULT_SITE_PREFIX`) + on every Cloudflare app's
// `wrangler.toml` resource names + Terraform `worker_name`. Registry-driven, so it
// reaches `code/shared/*` (api·cron·workers) and any app added later — no per-dir
// loop. Run from `code/projects/web/surfaces/website`:
//
//   pnpm project:rename <slug>      # e.g. acme → prefix "acme", names "acme-<env>-<platform>-<slug>"
//
// The slug is the per-client namespace: it prefixes browser keys (consent/theme/
// locale) AND the Cloudflare Worker/R2 names, so two clients under one account
// never collide. Must be unique per client.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  deployable,
  ENVS,
  resourceName,
} from "../../../../../shared/scripts/lib/apps.mjs";
import {
  CONFIG_INDEX,
  TEMPLATE_PREFIX,
  renameResourcePrefix,
} from "../../../../../shared/scripts/lib/project.mjs";

const slug = process.argv[2];
if (!slug || !/^[a-z][a-z0-9-]{2,40}$/.test(slug)) {
  console.error(
    "Usage: project:rename <slug>   (lowercase, a-z 0-9 -, 3–41 chars, starts with a letter)",
  );
  process.exit(1);
}
if (slug === TEMPLATE_PREFIX) {
  console.error(
    `✗ '${TEMPLATE_PREFIX}' is the template default — pick a slug unique to this client.`,
  );
  process.exit(1);
}

// Repo root, resolved from THIS script (not CWD) so `app.dir` (repo-relative) works.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../..");

// 1. Config: DEFAULT_SITE_PREFIX = "<template>" → "<slug>"
const config = readFileSync(CONFIG_INDEX, "utf8");
const nextConfig = config.replace(/(DEFAULT_SITE_PREFIX\s*=\s*)"[^"]*"/, `$1"${slug}"`);
if (nextConfig === config) {
  console.error(
    "✗ Could not find DEFAULT_SITE_PREFIX in @indiecrafts/packages-shared-config — aborting (nothing changed).",
  );
  process.exit(1);
}
writeFileSync(CONFIG_INDEX, nextConfig);

// Swap the LEADING `<template>-` prefix → `<slug>-` on resource-name assignment lines
// (name/bucket_name/database_name/dataset/service/queue/worker_name) AND on the
// `wrangler … create <template>-…` comment examples — so both the live config and the
// copy-paste create commands land on the client namespace. Prose comments stay untouched.
const swap = (text) => renameResourcePrefix(text, TEMPLATE_PREFIX, slug);

const renamed = [];
for (const app of deployable()) {
  const appRoot = resolve(REPO_ROOT, app.dir);
  // 2. The app's wrangler.toml.
  const wrangler = `${appRoot}/wrangler.toml`;
  if (existsSync(wrangler)) {
    const src = readFileSync(wrangler, "utf8");
    const out = swap(src);
    if (out !== src) {
      writeFileSync(wrangler, out);
      renamed.push(app.slug);
    }
  }
  // 3. The app's co-located Terraform tfvars (optional).
  for (const env of ENVS) {
    const file = `${appRoot}/infra/cloudflare/env/${env}.tfvars`;
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    const out = swap(src);
    if (out !== src) writeFileSync(file, out);
  }
}

console.log(`✓ Renamed project namespace → "${slug}"`);
console.log(`  · @indiecrafts/packages-shared-config  DEFAULT_SITE_PREFIX = "${slug}"`);
console.log(
  `  · wrangler.toml + tfvars  ${renamed.length} app(s): ${renamed.join(", ")}`,
);
console.log("\nNext:");
console.log("  1. Create the R2 buckets for the web app (one per env):");
for (const env of ENVS) {
  const stem = resourceName("website", env, slug);
  console.log(`       wrangler r2 bucket create ${stem}-isr`);
  console.log(`       wrangler r2 bucket create ${stem}-backups`);
}
console.log(
  "  2. Set NEXT_PUBLIC_SITE_PREFIX in your env only if it must differ from the config default.",
);
console.log("  3. pnpm verify:quick  →  commit.");
