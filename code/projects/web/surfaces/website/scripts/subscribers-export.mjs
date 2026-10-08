#!/usr/bin/env node
/**
 * Export newsletter subscribers to CSV.
 *
 *   pnpm export:web:website:subscribers          # who may receive the newsletter
 *   pnpm export:web:website:subscribers --all    # every subscriber doc, for an audit
 *
 * Writes ./backups/subscribers/subscribers-<timestamp>.csv. Read-only on the dataset.
 * Needs SANITY_API_READ_TOKEN (Viewer) or SANITY_API_WRITE_TOKEN in .env.local
 * (the package.json script loads it via --env-file).
 */

import { createClient } from "@sanity/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { csvCell } from "./lib/csv.mjs";

/**
 * The GROQ + columns. By default only people the newsletter may be sent to: confirmed
 * (double opt-in done) AND newsletter consent — a lead-magnet-only sign-up consented to its
 * document, not the newsletter (a doc older than the `newsletter` field counts unless it came
 * from a lead magnet). Pending and unsubscribed people are never in it. `all` lists every doc
 * with its status and consent, for an audit — never import that file into a mailing tool.
 */
export function exportQuery(all = false) {
  const fields = all
    ? ["email", "status", "newsletter", "consent", "source", "language", "createdAt"]
    : ["email", "language", "source", "createdAt"];
  const filter = all
    ? `_type == "subscriber"`
    : `_type == "subscriber" && status == "confirmed" && coalesce(newsletter, source != "lead-magnet")`;
  return {
    fields,
    query: `*[${filter}] | order(createdAt desc){ ${fields.join(", ")} }`,
  };
}

/** Rows → CSV, every cell formula-injection-safe (`csvCell`). */
export function toCsv(fields, rows) {
  return [
    fields.join(","),
    ...rows.map((r) => fields.map((f) => csvCell(r[f])).join(",")),
  ].join("\n");
}

async function main() {
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
  const all = process.argv.includes("--all");
  const { fields, query } = exportQuery(all);
  const rows = await client.fetch(query);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dir = resolve("backups/subscribers");
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, `subscribers${all ? "-all" : ""}-${stamp}.csv`);
  writeFileSync(file, `${toCsv(fields, rows)}\n`, "utf8");

  console.log(
    `✓ Exported ${rows.length} ${all ? "subscriber doc(s), every status (audit — do not mail)" : "newsletter subscriber(s)"} → ${file}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
