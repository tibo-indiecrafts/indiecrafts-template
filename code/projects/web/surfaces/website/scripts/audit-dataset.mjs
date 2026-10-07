#!/usr/bin/env node
/**
 * Read-only audit of the live Sanity dataset. Surfaces:
 *
 *   - Documents missing required language field (post, category, tag, quote,
 *     author, person)
 *   - Published posts with no slug (unreachable: every read skips them)
 *   - Posts whose author / category / tag refs no longer resolve
 *   - Drafts older than 30 days (drift indicator)
 *   - Orphan documents of types that have been removed from the schema
 *
 *   pnpm dlx tsx scripts/audit-dataset.mjs   # or:
 *   node --env-file=.env.local scripts/audit-dataset.mjs
 *
 * Needs SANITY_API_READ_TOKEN (viewer is enough).
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing SANITY_API_READ_TOKEN (or SANITY_API_WRITE_TOKEN).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const REMOVED_TYPES = ["logo", "form"];
const REMOVED_MODULE_TYPES = ["module.hero-split", "module.logo-list", "module.form"];

let issues = 0;
const report = (label, items) => {
  if (items.length === 0) {
    console.log(`✓ ${label}: none`);
    return;
  }
  console.log(`✗ ${label}: ${items.length}`);
  for (const item of items.slice(0, 10)) console.log(`    ${item}`);
  if (items.length > 10) console.log(`    … and ${items.length - 10} more`);
  issues += items.length;
};

console.log(`Auditing ${projectId}/${dataset}…`);
console.log("");

// 1. Documents missing a `language` field where the schema requires it.
const missingLanguage = await client.fetch(`*[
  _type in ["post", "category", "tag", "quote", "author", "person"] && !defined(language)
]{ _id, _type, title }`);
report(
  "Documents missing language field",
  missingLanguage.map((d) => `${d._type} ${d._id} (${d.title ?? "untitled"})`),
);

// 2. Documents of removed types still living in the dataset.
const orphanDocs = await client.fetch(`*[_type in $types]{ _id, _type }`, {
  types: REMOVED_TYPES,
});
report(
  "Documents of removed types (logo / form)",
  orphanDocs.map((d) => `${d._type} ${d._id}`),
);

// 3. Posts containing module instances of removed types in their body.
const dirtyPosts = await client.fetch(
  `*[_type == "post" && count(body[_type in $types]) > 0]{ _id, "leftover": body[_type in $types]._type }`,
  { types: REMOVED_MODULE_TYPES },
);
report(
  "Posts containing legacy module blocks",
  dirtyPosts.map((p) => `${p._id} (${[...new Set(p.leftover)].join(", ")})`),
);

// 4. Posts with no author, or an author reference that no longer resolves.
const brokenAuthors = await client.fetch(`*[
  _type == "post" && (
    count(coalesce(authors, [])) == 0 || count(authors[!defined(@->_id)]) > 0
  )
]{ _id, title, "authorCount": count(coalesce(authors, [])) }`);
report(
  "Posts with missing/broken author reference",
  brokenAuthors.map(
    (p) => `${p._id} (${p.title ?? "untitled"}, ${p.authorCount} author(s))`,
  ),
);

// 5. Posts with at least one category / tag ref that no longer resolves.
const brokenCats = await client.fetch(`*[
  _type == "post" && count(categories[!defined(@->_id)]) > 0
]{ _id, title, "broken": count(categories[!defined(@->_id)]) }`);
report(
  "Posts with broken category reference",
  brokenCats.map((p) => `${p._id} (${p.broken} broken, "${p.title ?? "?"}")`),
);

const brokenTags = await client.fetch(`*[
  _type == "post" && count(tags[!defined(@->_id)]) > 0
]{ _id, title, "broken": count(tags[!defined(@->_id)]) }`);
report(
  "Posts with broken tag reference",
  brokenTags.map((p) => `${p._id} (${p.broken} broken, "${p.title ?? "?"}")`),
);

// 6. Published posts with no slug — the Studio requires one, so these came in
// through the API (scripts, probes) and no page, feed or sitemap can reach them.
const noSlug = await client.fetch(`*[
  _type == "post" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))
    && !defined(media.slug.current)
]{ _id, title }`);
report(
  "Posts with no slug (unreachable)",
  noSlug.map((p) => `${p._id} (${p.title ?? "untitled"})`),
);

// 7. Drafts older than 30 days — possible drift.
const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
const staleDrafts = await client.fetch(
  `*[_id in path("drafts.**") && _updatedAt < $threshold]{ _id, _updatedAt, _type }`,
  { threshold },
);
report(
  "Stale drafts (> 30 days since last edit)",
  staleDrafts.map(
    (d) => `${d._id} (${d._type}, last touched ${d._updatedAt.slice(0, 10)})`,
  ),
);

console.log("");
console.log(issues === 0 ? "✓ Dataset is clean." : `✗ ${issues} issue(s) found.`);
process.exit(issues === 0 ? 0 : 1);
