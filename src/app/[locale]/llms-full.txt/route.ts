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
import { getMessages } from "next-intl/server";
import { ROUTES } from "@/app/routes";
import { isLlmsPage, renderAllPagesMarkdown } from "@/lib/seo/page-markdown";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if (!features.llms.full) return new Response("Not found", { status: 404 });

  const { locale } = (await params) as { locale: Locale };

  const visible = ROUTES.filter(isLlmsPage);

  const messages = (await getMessages({ locale })) as Record<string, unknown>;
  const body = renderAllPagesMarkdown(visible, locale, messages);

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
