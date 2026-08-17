#!/usr/bin/env node
/**
 * Export newsletter subscribers to CSV.
 *
 *   pnpm subscribers:export
 *
 * Writes ./backups/subscribers/subscribers-<timestamp>.csv. Read-only on the dataset.
 * Needs SANITY_API_READ_TOKEN (Viewer) or SANITY_API_WRITE_TOKEN in .env.local
 * (the package.json script loads it via --env-file).
 */

import { createClient } from "@sanity/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { csvCell } from "./lib/csv.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing token. Set SANITY_API_READ_TOKEN in .env.local to export.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const FIELDS = ["email", "status", "consent", "source", "language", "createdAt"];

const rows = await client.fetch(
  `*[_type == "subscriber"] | order(createdAt desc){ ${FIELDS.join(", ")} }`,
);

const csv = [
  FIELDS.join(","),
  ...rows.map((r) => FIELDS.map((f) => csvCell(r[f])).join(",")),
].join("\n");

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const dir = resolve("backups/subscribers");
mkdirSync(dir, { recursive: true });
const file = resolve(dir, `subscribers-${stamp}.csv`);
writeFileSync(file, `${csv}\n`, "utf8");

console.log(`✓ Exported ${rows.length} subscriber(s) → ${file}`);
