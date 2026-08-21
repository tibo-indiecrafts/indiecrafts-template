import { getTranslations } from "next-intl/server";
import { site } from "@/config";
import type { Locale } from "@/config";
import { isRssEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { localizedPathname } from "@/i18n/routing";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { rssPostsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { RssPost } from "@indiecrafts/modules-web-blog/sanity/types";

type Props = { params: Promise<{ locale: string }> };

/**
 * Atom 1.0 feed for the blog — the sibling of `rss.xml`. Same data
 * (`rssPostsQuery`), same locale pattern, same `isRssEnabled()` gate (blog +
 * rss flags); only the serialization differs. Atom uses ISO-8601 dates and a
 * `<feed>`/`<entry>` shape with stable `<id>`s, which some readers (and IndieWeb
 * tooling) prefer over RSS 2.0. Returns 404 when the blog or rss feature is off.
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
  const blogUrl = `${site.url}${localizedPathname("/blog", loc)}`;
  const feedUrl = `${site.url}${localizedPathname("/blog/atom.xml", loc)}`;
  // Feed `<updated>` = the newest post's date (falls back to now for an empty feed).
  const updated =
    posts
      .map((p) => p.publishedAt)
      .filter((d): d is string => !!d)
      .sort()
      .at(-1) ?? new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">
  <title>${escapeXml(siteName)} — ${escapeXml(t("title"))}</title>
  <subtitle>${escapeXml(siteSeo.description ?? "")}</subtitle>
  <link href="${feedUrl}" rel="self" type="application/atom+xml" />
  <link href="${blogUrl}" rel="alternate" type="text/html" />
  <id>${feedUrl}</id>
  <updated>${new Date(updated).toISOString()}</updated>
${posts.map((p) => renderEntry(p, loc)).join("\n")}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function renderEntry(post: RssPost, locale: Locale): string {
  const url = `${site.url}${localizedPathname(`/blog/${post.slug ?? ""}`, locale)}`;
  const title = post.metadata?.title ?? post.title ?? "";
  const summary = post.metadata?.description ?? "";
  const date = post.publishedAt ? new Date(post.publishedAt).toISOString() : null;
  const authorNames = post.authors?.flatMap((a) => (a.name ? [a.name] : [])) ?? [];
  const cats = post.categories?.flatMap((c) => (c.title ? [c.title] : [])) ?? [];

  return `  <entry>
    <title type="html"><![CDATA[${title}]]></title>
    <link href="${url}" rel="alternate" type="text/html" />
    <id>${url}</id>
    ${date ? `<updated>${date}</updated>` : `<updated>${new Date().toISOString()}</updated>`}
    ${date ? `<published>${date}</published>` : ""}
    ${summary ? `<summary type="html"><![CDATA[${summary}]]></summary>` : ""}
    ${authorNames.map((n) => `<author><name>${escapeXml(n)}</name></author>`).join("\n    ")}
    ${cats.map((c) => `<category term="${escapeXml(c)}" />`).join("\n    ")}
  </entry>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
