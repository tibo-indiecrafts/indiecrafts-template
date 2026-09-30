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
 *   - H1            = the site name (Sanity `siteSettings.siteName`)
 *   - blockquote    = `llms.summary`, else site `tagline`
 *   - paragraph     = `llms.paragraph`, else site `description`
 *   - "Last reviewed" = `llms.reviewedAt` (a date the editor keeps current)
 *   - H2 sections   = the visible `ROUTES` grouped by each page's `.seo.llmsSection`
 *                     (per-locale — every rendering doc is per-locale), ordered by
 *                     `llms.sectionOrder`; unsectioned pages fall under "## Pages" (last).
 *                     Each line pulls the page's title + `.seo` one-liner (`getPageSeo`).
 *   - "## Resources"= external links from `siteMeta.<locale>.llms.resources`
 *   - "Other languages" = a link to every other locale's llms.txt, so a crawler that
 *                     finds one file finds the translations
 *
 * SEO copy is Sanity-only (no config/messages fallback) — see `getSiteSeo` / `getPageSeo`.
 * The route's own labels (headings, "Last reviewed", …) are `messages.llms`, per locale.
 */

import type { Locale, PageConfig, StaticAppPathname } from "@/config";
import { defaultLocale, features, locales, site } from "@/config";
import { getTranslations } from "next-intl/server";
import { getStaticPathname } from "@/i18n/routing";
import { ROUTES } from "@/app/routes";
import { isLlmsPage } from "@/lib/seo/page-markdown";
import {
  DEFAULT_SITE_NAME,
  getPageSeo,
  getSiteSeo,
  getSiteSettings,
  type PageSeo,
} from "@/lib/seo/site-seo";
import {
  getBlogLlmsLines,
  getTaxonomyLlmsLines,
} from "@indiecrafts/modules-web-blog/lib/llms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if (!features.llms.index) return new Response("Not found", { status: 404 });

  const { locale } = (await params) as { locale: Locale };
  const [siteSeo, settings, t] = await Promise.all([
    getSiteSeo(locale),
    getSiteSettings(),
    getTranslations({ locale, namespace: "llms" }),
  ]);
  const siteName = settings.siteName || DEFAULT_SITE_NAME;

  // llms summary/paragraph, else the site tagline/description — all Sanity.
  const tagline = siteSeo.llms.summary ?? siteSeo.tagline;
  const description = siteSeo.llms.paragraph ?? siteSeo.description;

  // `/llms.txt` for the default locale, `/<code>/llms.txt` for the rest (as the route).
  const otherLanguages = locales
    .filter((l) => l.code !== locale)
    .map((l) => `[${l.label}](${site.url}${llmsPath(l.code)})`)
    .join(" · ");

  const header = [
    `# ${siteName}`,
    ``,
    ...(tagline ? [`> ${tagline}`, ``] : []),
    ...(description ? [description, ``] : []),
    ...(siteSeo.llms.reviewedAt
      ? [t("lastReviewed", { date: siteSeo.llms.reviewedAt })]
      : []),
    t("site", { url: site.url }),
    ...(otherLanguages ? [t("otherLanguages", { links: otherLanguages })] : []),
    ``,
  ];

  // Resolve each route's `.seo` once (React-cached), then build the per-page
  // section — dropping pages the editor marked noindex in Sanity.
  const pageSeoById = new Map<string, PageSeo | undefined>(
    await Promise.all(
      ROUTES.map(async (p) => [p.id, await getPageSeo(p.id, locale)] as const),
    ),
  );
  const visiblePages = ROUTES.filter(isLlmsPage).filter(
    (p) => !pageSeoById.get(p.id)?.noIndex,
  );

  // llms.txt's only edge over a sitemap is editorial judgement, so group the
  // pages into editor-defined H2 sections. Each page's section is its
  // `.seo.llmsSection` — per-locale, since every rendering doc is per-locale —
  // and the H2 order comes from `siteMeta.<locale>.llms.sectionOrder`.
  // Unsectioned pages fall under a default "Pages" heading, kept last.
  const DEFAULT_SECTION = "Pages";
  const groups = new Map<string, PageConfig[]>();
  for (const page of visiblePages) {
    const key = pageSeoById.get(page.id)?.llmsSection || DEFAULT_SECTION;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(page);
  }
  const order = siteSeo.llms.sectionOrder ?? [];
  const orderedSections = [
    ...order.filter((s) => groups.has(s) && s !== DEFAULT_SECTION),
    ...[...groups.keys()].filter((s) => !order.includes(s) && s !== DEFAULT_SECTION),
    ...(groups.has(DEFAULT_SECTION) ? [DEFAULT_SECTION] : []),
  ];
  const pageSection = orderedSections.flatMap((section) => [
    `## ${section === DEFAULT_SECTION ? t("pages") : section}`,
    ``,
    ...groups
      .get(section)!
      .map((page) => formatPageEntry(page, locale, pageSeoById.get(page.id))),
    ``,
  ]);

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
    ...pageSection,
    ...blogLines,
    ...taxonomyLines,
    ...(resourceLines.length > 0
      ? [`## ${t("resources")}`, ``, ...resourceLines, ``]
      : []),
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // Locale lives in the URL → CDN keys cleanly per locale, no query.
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function llmsPath(code: string): string {
  return code === defaultLocale ? "/llms.txt" : `/${code}/llms.txt`;
}

function formatPageEntry(page: PageConfig, locale: Locale, pageSeo?: PageSeo): string {
  const title = pageSeo?.title ?? page.id;
  // llmsSummary may be a few sentences — flatten to one line for the list bullet.
  const desc = (pageSeo?.llmsSummary ?? pageSeo?.description ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const pathname = getStaticPathname(page.key as StaticAppPathname, locale);
  const url = `${site.url}${pathname}`;
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`;
}
