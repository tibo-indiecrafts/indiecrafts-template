import type { Locale } from "@/config";
import { pages, site } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { allPostsQuery } from "@/features/blog/sanity/queries";
import type { PostListItem } from "@/features/blog/sanity/types";
import { sanityFetchLive } from "@/sanity/live";
import { isBlogRouteEnabled } from "./route-gate";

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
    const description = post.metadata?.description ?? "";
    const url = `${site.url}${localizedPathname(`/blog/${post.slug}/md`, locale)}`;
    return [
      description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`,
    ];
  });
  if (!entries.length) return [];

  return [`## Blog`, ``, ...entries, ``];
}
