/**
 * FAQ content lives in `messages.<locale>.pages.<id>.faq` — a translated
 * array of `{ question, answer }`. One source, three automatic consumers:
 *
 *   - `<Faq pageId="…">`            renders the accordion (display)
 *   - `PageSchemas`                 emits FAQPage JSON-LD (rich result)
 *   - `renderPageMarkdown`          adds a `## FAQ` block to /llms.txt outputs
 *
 * Add a FAQ to any page: drop the `faq` array into that page's messages and
 * mount `<Faq pageId="…">` where you want it shown. SEO + llms pick it up on
 * their own. All gated by `features.faq`.
 */

export type FaqItem = { question: string; answer: string };

function isFaqItem(x: unknown): x is FaqItem {
  return (
    !!x &&
    typeof x === "object" &&
    typeof (x as FaqItem).question === "string" &&
    typeof (x as FaqItem).answer === "string"
  );
}

/** Validate an unknown value (a raw messages node) into FAQ items. */
export function parseFaqItems(value: unknown): FaqItem[] {
  return Array.isArray(value) ? value.filter(isFaqItem) : [];
}

/**
 * Read a page's FAQ items via next-intl's `t.raw` (works on both the client
 * `useTranslations()` and server `getTranslations()` translators). Returns
 * `[]` when the key is absent or malformed.
 */
export function getFaqItems(raw: (key: string) => unknown, pageId: string): FaqItem[] {
  try {
    return parseFaqItems(raw(`pages.${pageId}.faq`));
  } catch {
    return [];
  }
}
