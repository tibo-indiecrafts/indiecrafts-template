/**
 * llms.txt configuration — content shown to LLM crawlers at /llms.txt.
 * See https://llmstxt.org for the spec.
 *
 * Heavy text is pulled from messages/<locale>.json under `llms.*` so it
 * can be translated; structural bits live here.
 */

export const llmsConfig = {
  /** Sections rendered in order. `bodyKey` points into messages.llms.sections.* */
  sections: [
    { key: "about", bodyKey: "about" },
    { key: "how-it-works", bodyKey: "howItWorks" },
    { key: "contact", bodyKey: "contact" },
  ],
  /** Links surfaced to the model for follow-up crawling. */
  resourceLinks: [
    { href: "/", labelKey: "home" },
    { href: "/", labelKey: "about" },
    { href: "/blog", labelKey: "blog" },
  ],
} as const;
