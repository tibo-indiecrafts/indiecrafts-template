/**
 * FAQ content now lives in the page-builder: the first `module.accordion-list`
 * block on the `homePage.<locale>` document. One source, two consumers:
 *
 *   - the visible `<AccordionList>` block (rendered in the homepage `pageModules`)
 *   - `PageSchemas` — emits FAQPage JSON-LD (rich result) from the same block
 *
 * Add/curate the FAQ by editing that accordion-list block in the Studio; the
 * rich result follows. Gated by `features.faq`.
 */

import type { Locale } from "@/config";
import type { PortableTextBlock } from "@portabletext/react";
import type { AccordionListModule } from "@indiecrafts/ui-components/shared/types";
import { getHomePage } from "@/lib/home";

export type FaqItem = { question: string; answer: string };

/** Flatten a PortableText answer to plain text for the JSON-LD `acceptedAnswer`. */
function blocksToText(blocks?: PortableTextBlock[]): string {
  return (blocks ?? [])
    .filter((b) => b._type === "block")
    .map((b) =>
      ((b.children ?? []) as { text?: string }[]).map((c) => c.text ?? "").join(""),
    )
    .join("\n\n")
    .trim();
}

/**
 * The page's FAQ items. Today only the homepage carries an FAQ (the first
 * accordion-list block); other pages return `[]`. Question = the item title,
 * answer = its rich-text content flattened to plain text.
 */
export async function getFaqItems(locale: Locale, pageId: string): Promise<FaqItem[]> {
  if (pageId !== "home") return [];
  const { pageModules } = await getHomePage(locale);
  const block = pageModules.find(
    (m): m is AccordionListModule => m._type === "module.accordion-list",
  );
  return (block?.items ?? [])
    .map((item) => ({ question: item.title ?? "", answer: blocksToText(item.content) }))
    .filter((f) => f.question && f.answer);
}
