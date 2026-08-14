import "server-only";

import { cache } from "react";
import { features } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";
import { blogDisplayQuery } from "../sanity/queries";
import type { BlogDisplay, BlogDisplayRaw } from "../sanity/types";

/** An unset toggle defaults to ON. */
const on = (v: boolean | undefined) => v ?? true;

/**
 * Fold the editor's raw `blog.display` toggles into the compiled feature
 * flags. Taxonomy is two-tier: a listing shows only when the code capability
 * (`features.blogTaxonomy.*`) AND the editor toggle are both on — so turning
 * a taxonomy off in the Studio removes its chips AND its route/sitemap/llms
 * entries. Everything else is editor-only (unset = shown).
 */
export function resolveBlogDisplay(raw: BlogDisplayRaw | null | undefined): BlogDisplay {
  const t = raw?.taxonomy ?? {};
  const p = raw?.post ?? {};
  return {
    taxonomy: {
      categories: features.blogTaxonomy.categories && on(t.categories),
      tags: features.blogTaxonomy.tags && on(t.tags),
      authors: features.blogTaxonomy.authors && on(t.authors),
    },
    post: {
      date: on(p.date),
      readingTime: on(p.readingTime),
      tableOfContents: on(p.tableOfContents),
      relatedPosts: on(p.relatedPosts),
      share: on(p.share),
      readingProgress: on(p.readingProgress),
    },
    frontpage: { featuredHero: on(raw?.frontpage?.featuredHero) },
    cards: { excerpt: on(raw?.cards?.excerpt) },
  };
}

/**
 * The blog's editor-editable display settings, resolved against the feature
 * flags. Request-deduped via React `cache` — call it freely from any server
 * component, route, or sitemap; only one fetch per request. Uses the published
 * client (build-safe), matching the other `client.fetch` reads.
 */
export const getBlogSettings = cache(
  async (): Promise<BlogDisplay> =>
    resolveBlogDisplay(await client.fetch<BlogDisplayRaw | null>(blogDisplayQuery)),
);
