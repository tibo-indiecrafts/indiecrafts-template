import type { CallToActionBlock } from "./schema";

export const cta01Key = "cta-01" as const;
export const cta01Namespace = "blocks.cta-01" as const;

/**
 * Default instance of the cta-01 block. Keys resolve under `blocks.cta-01.*`
 * at runtime via the messages aggregator. Spread over an `id` in a page
 * config to use the block with sample content.
 */
export const cta01Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-01",
  titleKey: "blocks.cta-01.title",
  bodyKey: "blocks.cta-01.body",
  emailPlaceholderKey: "blocks.cta-01.emailPlaceholder",
  submitLabelKey: "blocks.cta-01.submit",
};
