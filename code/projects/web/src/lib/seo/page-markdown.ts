/**
 * Page-to-markdown for `/llms-full.txt` and the per-page `/llms/<id>` endpoints.
 *
 * SANITY-ONLY — there is no auto-generation from `messages`. A page's markdown is:
 * a head (H1 title + URL + description, from the Sanity `pageSeo` entry) plus the
 * editor-authored `llmsFull` body when set. No `llmsFull` → head only. This mirrors
 * the rest of the SEO surface (Sanity is the sole source).
 */

import type { Locale, PageConfig, StaticAppPathname } from "@/config";
import { site } from "@/config";
import { getStaticPathname } from "@/i18n/routing";

/**
 * SEO/copy for one page, from `getSiteSeo(locale).pageSeo`. `llmsFull` is the
 * editor-authored full-dump body (Markdown).
 */
export type PageMarkdownSeo = {
  title?: string;
  description?: string;
  llmsFull?: string;
};

/**
 * Whether a page appears in the LLM endpoints. Single source of truth for
 * `/llms.txt`, `/llms-full.txt`, and `/llms/<id>` so the three can't drift.
 * A page is included when it's a real static route, enabled, indexable, and
 * hasn't opted out via `seo.llms: false` — so `noindex` pages drop out
 * automatically.
 */
export function isLlmsPage(page: PageConfig): boolean {
  return (
    !page.key.includes("[") &&
    page.enabled !== false &&
    !page.seo?.noindex &&
    page.seo?.llms !== false
  );
}

/**
 * Render one page to Markdown: head (title + URL + description from Sanity) plus
 * the `llmsFull` body when the editor set one.
 */
export function renderPageMarkdown(
  page: PageConfig,
  locale: Locale,
  seo?: PageMarkdownSeo,
): string {
  const title = seo?.title || page.id;
  const url = `${site.url}${getStaticPathname(page.key as StaticAppPathname, locale)}`;

  const parts = [`# ${title}`, "", `URL: ${url}`, ""];
  if (seo?.description) parts.push(seo.description, "");
  if (seo?.llmsFull) parts.push(seo.llmsFull, "");

  return parts.join("\n");
}

/** Concatenate every visible page's markdown for `/llms-full.txt`. */
export function renderAllPagesMarkdown(
  pages: readonly PageConfig[],
  locale: Locale,
  seoByPage?: ReadonlyMap<string, PageMarkdownSeo>,
): string {
  return pages
    .map((p) => renderPageMarkdown(p, locale, seoByPage?.get(p.id)))
    .join("\n---\n\n");
}
