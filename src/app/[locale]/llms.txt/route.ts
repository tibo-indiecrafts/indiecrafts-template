/**
 * /llms.txt — locale-aware plain-text site summary for LLM crawlers.
 * Spec: https://llmstxt.org
 *
 * URL pattern:
 *   /llms.txt        → default locale (en, no prefix)
 *   /fr/llms.txt     → French
 *   …                → one route per registered locale (auto)
 *
 * Content is auto-built:
 *   - H1            = site.name
 *   - blockquote    = locale-aware tagline (`messages.site.tagline`)
 *   - paragraph     = locale-aware description (`messages.site.description`)
 *   - "## Pages"    = every entry in `ROUTES` (= the `pages` map in
 *                     `@/config`), pulling each page's title + description
 *                     from `messages.pages.<id>.*` so entries are
 *                     locale-correct.
 *   - "## Resources"= optional external links from `llms.resources` in config.
 *
 * Each page therefore needs no llms-specific config — its existing SEO
 * keys (titleKey/descriptionKey or auto-derived `pages.<id>.*`) are reused.
 */

import type { Locale, PageConfig } from "@/config";
import { features, llms, site } from "@/config";
import { getTranslations } from "next-intl/server";
import { getStaticPathname } from "@/i18n/routing";
import type { MessageKey } from "@/types/messages";
import { ROUTES } from "@/app/routes";
import { isLlmsPage } from "@/lib/seo/page-markdown";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if (!features.llms.index) return new Response("Not found", { status: 404 });

  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale });

  const tagline = safeT(t, "site.tagline" as MessageKey, site.tagline);
  const description = safeT(t, "site.description" as MessageKey, site.description);

  const header = [
    `# ${site.name}`,
    ``,
    `> ${tagline}`,
    ``,
    description,
    ``,
    `Site: ${site.url}`,
    ``,
  ];

  // Auto per-page section
  const visiblePages = ROUTES.filter(isLlmsPage);
  const pageLines = visiblePages.map((page) => formatPageEntry(page, locale, t));

  // Optional non-route resources (external GitHub, docs sites, etc.)
  const resourceLines = llms.resources
    .filter((link) => link.href.startsWith("http"))
    .map((link) => {
      const label = safeT(t, `nav.${link.labelKey}` as MessageKey, link.labelKey);
      return `- [${label}](${link.href})`;
    });

  const body = [
    ...header,
    `## Pages`,
    ``,
    ...pageLines,
    ``,
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

function safeT(
  t: Awaited<ReturnType<typeof getTranslations>>,
  key: MessageKey,
  fallback: string,
): string {
  try {
    return t(key);
  } catch {
    return fallback;
  }
}

function formatPageEntry(
  page: PageConfig,
  locale: Locale,
  t: Awaited<ReturnType<typeof getTranslations>>,
): string {
  const titleKey = page.seo?.titleKey ?? (`pages.${page.id}.title` as MessageKey);
  const descKey =
    page.seo?.descriptionKey ?? (`pages.${page.id}.description` as MessageKey);
  const title = safeT(t, titleKey, page.id);
  const desc = safeT(t, descKey, "");
  const pathname = getStaticPathname(page.key, locale);
  const url = `${site.url}${pathname}`;
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`;
}
