/**
 * Per-page LLM companion. URL: `/<locale>/llms/<id>` — `/llms/home`,
 * `/fr/llms/home`, etc.
 *
 * Returns the page's content as Markdown, built Sanity-only from the page's
 * `siteMeta.<locale>.pageSeo` entry (title + description + the editor-authored
 * `llmsFull` body). Empty `llmsFull` → title + description only.
 *
 * Convention follows the emerging Mintlify / Anthropic pattern of exposing
 * per-page Markdown for direct LLM ingestion. The `.md` extension is
 * dropped from the URL because Next.js dynamic segments can't take a
 * literal extension suffix; Content-Type `text/markdown` makes the
 * format explicit.
 */

import type { Locale } from "@indiecrafts/config";
import { features } from "@indiecrafts/config";
import { ROUTES } from "@/app/routes";
import { isLlmsPage, renderPageMarkdown } from "@/lib/seo/page-markdown";
import { getSiteSeo } from "@/lib/seo/site-seo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; id: string }> },
) {
  if (!features.llms.pages) return new Response("Not found", { status: 404 });

  const { locale, id } = (await params) as { locale: Locale; id: string };
  const page = ROUTES.find((p) => p.id === id);
  if (!page || !isLlmsPage(page)) {
    return new Response("Not found", { status: 404 });
  }

  const siteSeo = await getSiteSeo(locale);
  const pageSeo = siteSeo.pageSeo.get(page.id);
  // Editor-set noindex hides the page from the LLM index too.
  if (pageSeo?.noindex) return new Response("Not found", { status: 404 });
  const body = renderPageMarkdown(page, locale, pageSeo);

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
