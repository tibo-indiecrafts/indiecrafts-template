/**
 * /llms.txt — locale-aware plain-text site summary for LLM crawlers.
 * Spec: https://llmstxt.org
 *
 * URL pattern:
 *   /llms.txt        → default locale (en, no prefix)
 *   /fr/llms.txt     → French
 *   …                → one route per registered locale (auto)
 *
 * Content is auto-built from the per-locale Sanity `siteMeta.<locale>` singleton:
 *   - H1            = site.name (brand)
 *   - blockquote    = `llms.summary`, else site `tagline`
 *   - paragraph     = `llms.paragraph`, else site `description`
 *   - "## Pages"    = every entry in `ROUTES` (= the `pages` map in `@/config`),
 *                     pulling each page's title + description from
 *                     `siteMeta.<locale>.pageSeo[pageId]`
 *   - "## Resources"= external links from `siteMeta.<locale>.llms.resources`
 *
 * SEO copy is Sanity-only (no config/messages fallback) — see `getSiteSeo`.
 */

import type { Locale, PageConfig } from "@/config";
import { features, site } from "@/config";
import { getStaticPathname } from "@/i18n/routing";
import { ROUTES } from "@/app/routes";
import { isLlmsPage } from "@/lib/seo/page-markdown";
import { getSiteSeo, type SiteSeo } from "@/lib/seo/site-seo";
import { getBlogLlmsLines, getTaxonomyLlmsLines } from "@/features/blog/lib/llms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if (!features.llms.index) return new Response("Not found", { status: 404 });

  const { locale } = (await params) as { locale: Locale };
  const siteSeo = await getSiteSeo(locale);

  // llms summary/paragraph, else the site tagline/description — all Sanity.
  const tagline = siteSeo.llms.summary ?? siteSeo.tagline;
  const description = siteSeo.llms.paragraph ?? siteSeo.description;

  const header = [
    `# ${site.name}`,
    ``,
    ...(tagline ? [`> ${tagline}`, ``] : []),
    ...(description ? [description, ``] : []),
    `Site: ${site.url}`,
    ``,
  ];

  // Auto per-page section — drop pages the editor marked noindex in Sanity.
  const visiblePages = ROUTES.filter(isLlmsPage).filter(
    (p) => !siteSeo.pageSeo.get(p.id)?.noindex,
  );
  const pageLines = visiblePages.map((page) => formatPageEntry(page, locale, siteSeo));

  // Published blog posts (empty when the blog surface is off), each linking
  // to its `/md` export.
  const blogLines = await getBlogLlmsLines(locale);
  // Taxonomy sections (## Categories / ## Tags / ## Authors), one line each.
  const taxonomyLines = await getTaxonomyLlmsLines(locale);

  // Optional non-route resources (external links) — editor-set in Sanity.
  const resourceLines = siteSeo.llms.resources.flatMap((r) =>
    r.href.startsWith("http") ? [`- [${r.name}](${r.href})`] : [],
  );

  const body = [
    ...header,
    `## Pages`,
    ``,
    ...pageLines,
    ``,
    ...blogLines,
    ...taxonomyLines,
    ...(resourceLines.length > 0 ? [`## Resources`, ``, ...resourceLines, ``] : []),
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // Locale lives in the URL → CDN keys cleanly per locale, no query.
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function formatPageEntry(page: PageConfig, locale: Locale, siteSeo: SiteSeo): string {
  const pageSeo = siteSeo.pageSeo.get(page.id);
  const title = pageSeo?.title ?? page.id;
  // llmsSummary may be a few sentences — flatten to one line for the list bullet.
  const desc = (pageSeo?.llmsSummary ?? pageSeo?.description ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const pathname = getStaticPathname(page.key, locale);
  const url = `${site.url}${pathname}`;
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`;
}
