/**
 * `/llms-full.txt` — full site content concatenated for LLM ingestion.
 *
 * URL pattern:
 *   /llms-full.txt         → default locale (en, no prefix)
 *   /fr/llms-full.txt      → French
 *
 * Emerging convention used by Anthropic, Mintlify, and similar projects:
 * a single document that exposes every page's content so LLMs can ingest
 * the whole site in one fetch without crawling per-URL.
 *
 * Each page section is the same Markdown that `/llms/<id>` returns, joined
 * with `---` separators. Skips dynamic routes, `noindex`, and disabled pages.
 */

import type { Locale } from "@/config";
import { features } from "@/config";
import { ROUTES } from "@/app/routes";
import {
  isLlmsPage,
  renderAllPagesMarkdown,
  type PageMarkdownSeo,
} from "@/lib/seo/page-markdown";
import { getPageSeo, getSiteSeo } from "@/lib/seo/site-seo";
import {
  getBlogLlmsLines,
  getTaxonomyLlmsLines,
} from "@indiecrafts/modules-web-blog/lib/llms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if (!features.llms.full) return new Response("Not found", { status: 404 });

  const { locale } = (await params) as { locale: Locale };

  const siteSeo = await getSiteSeo(locale);
  // Resolve each route's `.seo` once (React-cached), then drop pages the editor
  // marked noindex in Sanity.
  const pageSeoById = new Map<string, PageMarkdownSeo>(
    await Promise.all(
      ROUTES.map(async (p) => {
        const seo = await getPageSeo(p.id, locale);
        return [
          p.id,
          {
            title: seo?.title,
            description: seo?.description,
            llmsFull: seo?.llmsFull,
            noIndex: seo?.noIndex,
          },
        ] as const;
      }),
    ),
  );
  const visible = ROUTES.filter(isLlmsPage).filter(
    (p) => !pageSeoById.get(p.id)?.noIndex,
  );
  const pagesMarkdown = renderAllPagesMarkdown(visible, locale, pageSeoById);

  // Append a `## Blog` directory of published posts (each links to its `/md`
  // full-text export). Empty when the blog surface is off.
  const blogLines = await getBlogLlmsLines(locale);
  // Taxonomy sections with each doc's `llmsFull` body inlined.
  const taxonomyLines = await getTaxonomyLlmsLines(locale, { full: true });
  const sections = [
    // Site-level intro (`siteMeta.<locale>.llms.full`), when set.
    siteSeo.llms.full,
    pagesMarkdown,
    blogLines.length ? blogLines.join("\n") : undefined,
    taxonomyLines.length ? taxonomyLines.join("\n") : undefined,
  ].filter(Boolean);
  const body = sections.join("\n\n---\n\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
