#!/usr/bin/env node
/**
 * One-time move — give every document that holds personal or operator data a
 * private (dotted) id.
 *
 *   pnpm sanity:privatize                      # dry run: prints the plan
 *   pnpm sanity:privatize -- --apply           # writes it
 *   pnpm sanity:privatize -- --dataset tests-e2e --apply
 *
 * Sanity's free plan has public datasets only: anyone can read a document
 * without a token unless its id contains a dot. The forms now create
 * `private.<type>.<uuid>` ids and the E-mails singleton lives at
 * `private.emailStrings`; this script moves the documents written before that:
 *
 *   - `comment` · `contactMessage` · `waitlistEntry` → `private.<type>.<old id>`
 *     (a leading `<type>.` is dropped: `comment.demo-approved` →
 *     `private.comment.demo-approved`, the id the seed writes)
 *   - `emailStrings` → `private.emailStrings`
 *
 * Drafts move with their document; a reference to a moved id (a reply's
 * `parent`) is rewritten. One transaction: all or nothing. Safe to re-run:
 * a `private.` id is never moved again. Needs SANITY_API_WRITE_TOKEN (Editor).
 */

import { createClient } from "@sanity/client";
import { pathToFileURL } from "node:url";

export const PERSONAL_TYPES = ["comment", "contactMessage", "waitlistEntry"];
const SINGLETONS = { emailStrings: "private.emailStrings" };
const DRAFT = "drafts.";

/** The private id for an existing document, or `null` when it is private already. Pure. */
export function privateIdFor({ _id, _type }) {
  const draft = _id.startsWith(DRAFT);
  const base = draft ? _id.slice(DRAFT.length) : _id;
  if (base.startsWith("private.")) return null;
  const rest = base.startsWith(`${_type}.`) ? base.slice(_type.length + 1) : base;
  const target = SINGLETONS[_type] ?? `private.${_type}.${rest}`;
  return draft ? DRAFT + target : target;
}

/** A deep copy of `value` with every `_ref` found in `ids` (old → new) rewritten. Pure. */
export function rewriteRefs(value, ids) {
  if (Array.isArray(value)) return value.map((v) => rewriteRefs(v, ids));
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = k === "_ref" && ids.has(v) ? ids.get(v) : rewriteRefs(v, ids);
  }
  return out;
}

// The API sets these itself on write.
const stripSystem = ({ _rev: _r, _updatedAt: _u, ...doc }) => doc;

/**
 * The move as three lists: documents to create (new ids, references rewritten),
 * referencing documents to replace (references rewritten) and old ids to delete. Pure.
 */
export function planMoves(docs, referrers = []) {
  const moves = docs
    .map((doc) => [doc, privateIdFor(doc)])
    .filter(([, id]) => id !== null);
  const published = (id) => (id.startsWith(DRAFT) ? id.slice(DRAFT.length) : id);
  const ids = new Map(moves.map(([doc, id]) => [published(doc._id), published(id)]));
  const moved = new Set(moves.map(([doc]) => doc._id));
  return {
    creates: moves.map(([doc, id]) => stripSystem({ ...rewriteRefs(doc, ids), _id: id })),
    patches: referrers
      .filter((doc) => !moved.has(doc._id))
      .map((doc) => stripSystem(rewriteRefs(doc, ids))),
    deletes: [...moved],
  };
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const flag = args.indexOf("--dataset");
  const dataset =
    flag !== -1
      ? args[flag + 1]
      : (process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production");
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    console.error(
      "✗ Needs NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_API_WRITE_TOKEN (Editor).",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "raw", // drafts too
  });
  const docs = await client.fetch(`*[_type in $types]`, {
    types: [...PERSONAL_TYPES, ...Object.keys(SINGLETONS)],
  });
  const oldIds = docs.filter((d) => privateIdFor(d)).map((d) => d._id);
  const referrers = oldIds.length
    ? await client.fetch(`*[references($ids)]`, { ids: oldIds })
    : [];
  const { creates, patches, deletes } = planMoves(docs, referrers);

  console.log(
    `${projectId}/${dataset}: ${creates.length} to move, ${patches.length} referrer(s) to update.`,
  );
  for (let i = 0; i < creates.length; i++)
    console.log(`  ${deletes[i]} → ${creates[i]._id}`);
  if (!creates.length) return console.log("✓ Nothing to move.");
  if (!apply) return console.log("Dry run. Re-run with --apply to write.");

  let tx = client.transaction();
  for (const doc of [...creates, ...patches]) tx = tx.createOrReplace(doc);
  for (const id of deletes) tx = tx.delete(id);
  const res = await tx.commit();
  console.log(`✓ Moved in transaction ${res.transactionId}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error("✗ Move failed:", err.message);
    process.exit(1);
  });
}
