import { getTranslations } from "next-intl/server";
import { site } from "@/config";
import type { Locale } from "@/config";
import { isRssEnabled } from "@indiecrafts/blog/lib/route-gate";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { localizedPathname } from "@/i18n/routing";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import { rssPostsQuery } from "@indiecrafts/blog/sanity/queries";
import type { RssPost } from "@indiecrafts/blog/sanity/types";

type Props = { params: Promise<{ locale: string }> };

/**
 * RSS 2.0 feed for the blog. One per locale; matches the sitemap/llms.txt
 * locale pattern. Honors `metadata.noIndex` (hidden posts are filtered
 * out by the query). Returns 404 when the blog or rss feature is off (via
 * `isRssEnabled`).
 *
 * Pattern adapted from sanitypress-with-typegen — kept stripped of the
 * <content:encoded> body export to avoid the additional `@portabletext/to-html`
 * dependency. Add it back if you want full-text in feed readers.
 */
export async function GET(_req: Request, { params }: Props) {
  if (!isRssEnabled()) {
    return new Response("Not found", { status: 404 });
  }
  const { locale } = await params;
  const loc = locale as Locale;
  const [posts, t, settings, siteSeo] = await Promise.all([
    sanityFetchLive<RssPost[]>({ query: rssPostsQuery, params: { locale } }),
    getTranslations({ locale: loc, namespace: "pages.blog" }),
    getSiteSettings(),
    getSiteSeo(loc),
  ]);
  const siteName = settings.siteName || DEFAULT_SITE_NAME;
  // Locale-aware URLs — matches canonical/sitemap (default locale, no prefix).
  const blogUrl = `${site.url}${localizedPathname("/blog", loc)}`;
  const feedUrl = `${site.url}${localizedPathname("/blog/rss.xml", loc)}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${escapeXml(siteName)} — ${escapeXml(t("title"))}</title>
  <link>${blogUrl}</link>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
  <description>${escapeXml(siteSeo.description ?? "")}</description>
  <language>${locale}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts.map((p) => renderItem(p, loc)).join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function renderItem(post: RssPost, locale: Locale): string {
  const url = `${site.url}${localizedPathname(`/blog/${post.slug ?? ""}`, locale)}`;
  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description ?? "";
  const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : null;
  const authorNames = post.authors?.flatMap((a) => (a.name ? [a.name] : [])) ?? [];
  const cats = post.categories?.flatMap((c) => (c.title ? [c.title] : [])) ?? [];
  const image = post.metadata?.image?.asset?.url;

  return `  <item>
    <title><![CDATA[${title}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    ${description ? `<description><![CDATA[${description}]]></description>` : ""}
    ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
    ${authorNames.map((n) => `<dc:creator>${escapeXml(n)}</dc:creator>`).join("\n    ")}
    ${cats.map((c) => `<category>${escapeXml(c)}</category>`).join("\n    ")}
    ${image ? `<enclosure url="${image}" length="0" type="image/jpeg" />` : ""}
  </item>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
