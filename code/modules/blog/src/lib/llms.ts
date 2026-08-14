import type { Locale } from "@indiecrafts/config";
import { pages, site } from "@indiecrafts/config";
import { localizedPathname } from "@indiecrafts/i18n";
import { allPostsQuery, taxonomyForLlmsQuery } from "@indiecrafts/blog/sanity/queries";
import type { PostListItem } from "@indiecrafts/blog/sanity/types";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import { isBlogRouteEnabled } from "./route-gate";
import { getBlogSettings } from "./settings";

/**
 * The blog's contribution to the LLM endpoints: a `## Blog` section listing
 * every published, indexable post for the locale, each linking to its `/md`
 * Markdown export (the clean, text-only version an agent should ingest).
 *
 * Returns `[]` when the public blog surface is off (`isBlogRouteEnabled`) or
 * there are no posts — so `/llms.txt` and `/llms-full.txt` stay blog-agnostic
 * and never emit an empty `## Blog` heading. `allPostsQuery` already filters
 * `metadata.noIndex` and scopes by locale.
 */
export async function getBlogLlmsLines(locale: Locale): Promise<string[]> {
  if (!isBlogRouteEnabled(pages.blog)) return [];

  const posts = await sanityFetchLive<PostListItem[]>({
    query: allPostsQuery,
    params: { locale },
  });
  if (!posts?.length) return [];

  const entries = posts.flatMap((post) => {
    if (!post.slug) return [];
    const title = post.metadata?.title ?? post.title ?? post.slug;
    const description = (post.metadata?.llmsSummary ?? post.metadata?.description ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const url = `${site.url}${localizedPathname(`/blog/${post.slug}/md`, locale)}`;
    return [
      description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`,
    ];
  });
  if (!entries.length) return [];

  return [`## Blog`, ``, ...entries, ``];
}

type TaxonomyLlmsItem = {
  slug?: string;
  title?: string;
  summary?: string;
  full?: string;
};

const TAXONOMIES = [
  {
    type: "category",
    key: "categories",
    heading: "Categories",
    path: (slug: string) => `/blog/category/${slug}` as const,
  },
  {
    type: "tag",
    key: "tags",
    heading: "Tags",
    path: (slug: string) => `/blog/tag/${slug}` as const,
  },
  {
    type: "author",
    key: "authors",
    heading: "Authors",
    path: (slug: string) => `/author/${slug}` as const,
  },
] as const;

/**
 * The taxonomy contribution to the LLM endpoints: `## Categories` / `## Tags` /
 * `## Authors` sections, one line per detail page (`llmsSummary` ?? `description`),
 * gated by `features.blogTaxonomy.*` + each doc's noindex. With `{ full: true }`
 * (for `/llms-full.txt`), each doc's `llmsFull` body is inlined under its line.
 */
export async function getTaxonomyLlmsLines(
  locale: Locale,
  { full = false }: { full?: boolean } = {},
): Promise<string[]> {
  if (!isBlogRouteEnabled(pages.blog)) return [];

  const settings = await getBlogSettings();
  const out: string[] = [];
  for (const tax of TAXONOMIES) {
    if (!settings.taxonomy[tax.key]) continue;

    const items = await sanityFetchLive<TaxonomyLlmsItem[]>({
      query: taxonomyForLlmsQuery,
      params: { type: tax.type, locale },
    });
    if (!items?.length) continue;

    const lines = items.flatMap((it) => {
      if (!it.slug) return [];
      const url = `${site.url}${localizedPathname(tax.path(it.slug), locale)}`;
      const desc = (it.summary ?? "").replace(/\s+/g, " ").trim();
      const line = desc ? `- [${it.title}](${url}): ${desc}` : `- [${it.title}](${url})`;
      return full && it.full ? [line, ``, it.full, ``] : [line];
    });
    if (lines.length) out.push(`## ${tax.heading}`, ``, ...lines, ``);
  }
  return out;
}
