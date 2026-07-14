/**
 * Per-page LLM companion. URL: `/<locale>/llms/<id>` — `/llms/home`,
 * `/fr/llms/home`, etc.
 *
 * Returns the page's content rendered as Markdown from
 * `messages.<locale>.pages.<id>.*`. No per-page config — every registered
 * page automatically gets this endpoint.
 *
 * Convention follows the emerging Mintlify / Anthropic pattern of exposing
 * per-page Markdown for direct LLM ingestion. The `.md` extension is
 * dropped from the URL because Next.js dynamic segments can't take a
 * literal extension suffix; Content-Type `text/markdown` makes the
 * format explicit.
 */

import type { Locale } from "@/config";
import { features } from "@/config";
import { getMessages } from "next-intl/server";
import { ROUTES } from "@/app/routes";
import { isLlmsPage, renderPageMarkdown } from "@/lib/seo/page-markdown";

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

  const messages = (await getMessages({ locale })) as Record<string, unknown>;
  const body = renderPageMarkdown(page, locale, messages);

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
