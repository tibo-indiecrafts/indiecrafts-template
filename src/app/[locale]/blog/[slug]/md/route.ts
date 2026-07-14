import { pages, site } from "@/config";
import { isBlogRouteEnabled } from "@/lib/feature-gate";
import { sanityFetchLive } from "@/sanity/live";
import { portableTextToMarkdown } from "@/sanity/portable-to-markdown";
import { postBySlugQuery } from "@/sanity/queries";
import type { Post } from "@/sanity/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

/**
 * Markdown export of a post — `/<locale>/blog/<slug>/md`. Lets AI agents
 * fetch a clean text-only version of an article without parsing HTML.
 *
 * Pattern inspired by sanitypress's `/api/md/[...slug]` route, but
 * serialized directly from PortableText instead of round-tripping
 * through rendered HTML. Honors `metadata.noIndex` — hidden posts 404.
 *
 * The post page advertises this URL via
 *   `<link rel="alternate" type="text/markdown" href=".../md">`
 * (see `generateMetadata` in the sibling `page.tsx`).
 */
export async function GET(_req: Request, { params }: Props) {
  if (!isBlogRouteEnabled(pages.blog)) {
    return new Response("Not found", { status: 404 });
  }
  const { locale, slug } = await params;

  const post = await sanityFetchLive<Post | null>({
    query: postBySlugQuery,
    params: { slug, locale },
  });
  if (!post || post.metadata?.noIndex) {
    return new Response("Not found", { status: 404 });
  }

  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description ?? "";
  const published = post.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 10)
    : "";
  const canonical = `${site.url}/${locale}/blog/${slug}`;

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    description && `description: ${JSON.stringify(description)}`,
    published && `date: ${published}`,
    post.author?.name && `author: ${JSON.stringify(post.author.name)}`,
    `canonical: ${canonical}`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const body = post.body ? portableTextToMarkdown(post.body) : "";
  const markdown = `${frontmatter}\n\n# ${title}\n\n${body}\n`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
