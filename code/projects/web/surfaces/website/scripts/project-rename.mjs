/**
 * Swap the client namespace prefix across config, wrangler.toml, tfvars, and Expo config.
 *
 * @see docs/reference/projects/web/website/scripts/project-rename.md
 */
// Rename the project's namespace in ONE command — for reusing this template per
// client. Cloudflare resource names are `<prefix>-<env>-<platform>-<slug>`
// (`resourceName` in apps.mjs), so ONLY `<prefix>` is client-specific: this swaps
// it in `@indiecrafts/packages-shared-config` (`DEFAULT_SITE_PREFIX`) + on EVERY
// `wrangler.toml` resource name + Terraform `worker_name` under `code/`, plus the
// native (expo) config. A repo-wide sweep (not registry-driven) so it also reaches
// non-registry deployables — the `tools/storybook` Worker + any app added later. Run
// from `code/projects/web/surfaces/website`:
//
//   pnpm project:rename <slug>            # e.g. acme → "acme-<env>-<platform>-<slug>"
//   pnpm project:rename <slug> --dry-run  # print what WOULD change, write nothing
//
// The slug is the per-client namespace: it prefixes browser keys (consent/theme/
// locale) AND the Cloudflare Worker/R2 names, so two clients under one account
// never collide. Must be unique per client.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ENVS, resourceName } from "../../../../../shared/scripts/lib/apps.mjs";
import {
  CONFIG_INDEX,
  TEMPLATE_PREFIX,
  renameResourcePrefix,
} from "../../../../../shared/scripts/lib/project.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const slug = args.find((a) => !a.startsWith("-"));
if (!slug || !/^[a-z][a-z0-9-]{2,40}$/.test(slug)) {
  console.error(
    "Usage: project:rename <slug> [--dry-run]   (lowercase, a-z 0-9 -, 3–41 chars, starts with a letter)",
  );
  process.exit(1);
}
if (slug === TEMPLATE_PREFIX) {
  console.error(
    `✗ '${TEMPLATE_PREFIX}' is the template default — pick a slug unique to this client.`,
  );
  process.exit(1);
}

// Repo root, resolved from THIS script (not CWD) so the walk + `app.dir` work.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const tag = dryRun ? " [dry-run]" : "";

const write = (file, text) => {
  if (!dryRun) writeFileSync(file, text);
};

// 1. Config: DEFAULT_SITE_PREFIX = "<template>" → "<slug>"
const config = readFileSync(CONFIG_INDEX, "utf8");
const nextConfig = config.replace(/(DEFAULT_SITE_PREFIX\s*=\s*)"[^"]*"/, `$1"${slug}"`);
if (nextConfig === config) {
  console.error(
    "✗ Could not find DEFAULT_SITE_PREFIX in @indiecrafts/packages-shared-config — aborting (nothing changed).",
  );
  process.exit(1);
}
write(CONFIG_INDEX, nextConfig);

// Swap the LEADING `<template>-` prefix → `<slug>-` on resource-name assignment lines
// (name/bucket_name/database_name/dataset/service/queue/worker_name/BACKUP_BUCKET) AND on
// the `wrangler … create <template>-…` comment examples. Prose comments stay untouched.
const swap = (text) => renameResourcePrefix(text, TEMPLATE_PREFIX, slug);

// 2 + 3. EVERY wrangler.toml + Terraform tfvars under `code/`, found by a repo-wide walk
// that skips build output + deps — registry apps AND non-registry tools (storybook), so a
// rename is complete regardless of whether a dir is in `apps.mjs`.
const SKIP = new Set([
  "node_modules",
  ".git",
  ".next",
  ".open-next",
  ".wrangler",
  ".turbo",
  "dist",
  "storybook-static",
  ".sanity",
  "coverage",
]);
function walkInfra(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP.has(entry.name)) walkInfra(join(dir, entry.name), out);
    } else if (
      basename(entry.name) === "wrangler.toml" ||
      entry.name.endsWith(".tfvars")
    ) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

const changed = [];
for (const file of walkInfra(resolve(REPO_ROOT, "code"))) {
  const src = readFileSync(file, "utf8");
  const out = swap(src);
  if (out !== src) {
    write(file, out);
    changed.push(relative(REPO_ROOT, file));
  }
}

// 4. The native surface (expo) carries the prefix in its OWN config, not a
// wrangler.toml — so the infra walk never reaches it. Swap it here so a rename is
// COMPLETE: the Expo app slug/scheme + reverse-DNS bundle id and the EAS build env's
// api-URL prefix. Keyed off TEMPLATE_PREFIX (alphanumeric, safe to interpolate).
const P = TEMPLATE_PREFIX;
const nativeFiles = [
  {
    path: "code/projects/mobile/surfaces/main/app.config.ts",
    subs: [
      [new RegExp(`(\\b(?:name|slug|scheme):\\s*)"${P}"`, "g"), `$1"${slug}"`],
      [new RegExp(`"dev\\.${P}\\.`, "g"), `"dev.${slug}.`],
    ],
  },
  {
    path: "code/projects/mobile/surfaces/main/eas.json",
    subs: [[new RegExp(`//${P}-`, "g"), `//${slug}-`]],
  },
];
const nativeRenamed = [];
for (const { path, subs } of nativeFiles) {
  const file = resolve(REPO_ROOT, path);
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  let out = src;
  for (const [re, rep] of subs) out = out.replace(re, rep);
  if (out !== src) {
    write(file, out);
    nativeRenamed.push(path); // already repo-relative
  }
}

console.log(`✓ Renamed project namespace → "${slug}"${tag}`);
console.log(`  · @indiecrafts/packages-shared-config  DEFAULT_SITE_PREFIX = "${slug}"`);
console.log(`  · wrangler.toml + tfvars  ${changed.length} file(s):`);
for (const f of changed) console.log(`      ${f}`);
if (nativeRenamed.length) {
  console.log(`  · native config  ${nativeRenamed.length} file(s):`);
  for (const f of nativeRenamed) console.log(`      ${f}`);
}
if (dryRun) {
  console.log("\n[dry-run] Nothing written. Re-run without --dry-run to apply.");
  process.exit(0);
}
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
