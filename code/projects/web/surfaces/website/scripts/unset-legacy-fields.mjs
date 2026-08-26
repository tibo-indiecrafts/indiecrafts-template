#!/usr/bin/env node
/**
 * One-shot cleanup — unset legacy fields from the dataset after a
 * schema field is removed.
 *
 *   pnpm dlx tsx scripts/unset-legacy-fields.mjs   # or:
 *   node --env-file=.env.local scripts/unset-legacy-fields.mjs
 *
 * Currently targets one field removed in an earlier release:
 *   - `post.modules` (per-post layout override — removed; replaced by
 *     `blog.postModules`)
 *
 * `blog.frontpageModules` used to be a second target here (a field removed
 * in the same earlier release) — it's gone from TARGETS because the name
 * was reused: the composable blog frontpage now owns a live
 * `blog.frontpageModules` array. Running this script against a dataset
 * that has that feature's data would delete it. Don't re-add the name
 * without renaming the new field first.
 *
 * Sanity's CLI has no `documents patch` subcommand, so this uses the
 * @sanity/client directly. Needs a write-capable token in
 * SANITY_API_WRITE_TOKEN (Editor role).
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN (Editor role).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

/** [GROQ query returning _ids, field-path to unset] */
const TARGETS = [['*[_type == "post" && defined(modules)]._id', "modules"]];

let total = 0;

for (const [query, field] of TARGETS) {
  const ids = await client.fetch(query);
  if (ids.length === 0) {
    console.log(`✓ ${field}: nothing to unset (0 docs)`);
    continue;
  }
  let tx = client.transaction();
  for (const id of ids) {
    tx = tx.patch(id, (p) => p.unset([field]));
  }
  await tx.commit({ visibility: "async" });
  console.log(`✓ ${field}: unset on ${ids.length} doc(s)`);
  total += ids.length;
}

console.log("");
console.log(`Done. ${total} patch(es) committed.`);
