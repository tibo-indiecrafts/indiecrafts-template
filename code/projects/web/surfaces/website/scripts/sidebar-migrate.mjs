#!/usr/bin/env node
/**
 * One-time update of an existing dataset for the block sidebar and the blog blocks on pages.
 *
 *   node --env-file=.env.local scripts/sidebar-migrate.mjs            # dry run: prints the plan
 *   node --env-file=.env.local scripts/sidebar-migrate.mjs --apply    # writes it
 *   … --dataset tests-e2e --apply
 *
 * - Creates `sidebarSettings-<locale>` (articles: the post's TOC + related posts), so posts
 *   keep the sidebar they had before it became configurable.
 * - Adds the "Articles à la une" block to each home page (published and draft) that has
 *   none: the strip the home used to render in code.
 * - Unsets `blog.display.post.tableOfContents`: the TOC is now a sidebar card.
 *
 * New datasets get all three from the seed. Safe to re-run: each step skips what is done.
 * One transaction. Needs SANITY_API_WRITE_TOKEN (Editor).
 */

import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import {
  HOME_FEATURED_COPY,
  homeFeaturedBlock,
  sidebarSettingsDoc,
} from "./lib/blocks-sidebar.mjs";

const LANGS = Object.keys(HOME_FEATURED_COPY);
const key = () => randomUUID().slice(0, 12);

/**
 * The writes, from the current documents (published + drafts): settings to create, home
 * pages to append the featured block to, blog docs to unset the TOC toggle on. Pure.
 */
export function planSidebarMigration(docs, newKey = key) {
  const ids = new Set(docs.map((d) => d._id));
  const creates = LANGS.filter((l) => !ids.has(`sidebarSettings-${l}`)).map((l) =>
    sidebarSettingsDoc(l, newKey),
  );
  const homes = docs
    .filter((d) => d._type === "page" && d.isHome === true)
    .filter((d) => !(d.sections ?? []).some((s) => s._type === "module.blog-featured"))
    .filter((d) => LANGS.includes(d.language))
    .map((d) => ({ id: d._id, block: homeFeaturedBlock(d.language, newKey()) }));
  const blogs = docs
    .filter((d) => d._type === "blog" && d.display?.post?.tableOfContents !== undefined)
    .map((d) => d._id);
  return { creates, homes, blogs };
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
  const docs = await client.fetch(
    `*[_id in $settings || (_type == "page" && isHome == true) || _type == "blog"]{
      _id, _type, isHome, language, "sections": sections[]{ _type }, display
    }`,
    { settings: LANGS.map((l) => `sidebarSettings-${l}`) },
  );
  const { creates, homes, blogs } = planSidebarMigration(docs);

  console.log(`${projectId}/${dataset}:`);
  for (const d of creates) console.log(`  create ${d._id}`);
  for (const h of homes) console.log(`  ${h.id}: add "Articles à la une"`);
  for (const id of blogs) console.log(`  ${id}: unset display.post.tableOfContents`);
  if (!creates.length && !homes.length && !blogs.length)
    return console.log("✓ Nothing to do.");
  if (!apply) return console.log("Dry run. Re-run with --apply to write.");

  let tx = client.transaction();
  for (const d of creates) tx = tx.createIfNotExists(d);
  for (const h of homes)
    tx = tx.patch(h.id, (p) =>
      p.setIfMissing({ sections: [] }).append("sections", [h.block]),
    );
  for (const id of blogs)
    tx = tx.patch(id, (p) => p.unset(["display.post.tableOfContents"]));
  const res = await tx.commit();
  console.log(`✓ Written in transaction ${res.transactionId}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error("✗ Migration failed:", err.message);
    process.exit(1);
  });
}
