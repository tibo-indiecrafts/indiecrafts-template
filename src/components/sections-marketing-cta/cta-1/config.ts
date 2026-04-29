import type { CallToActionBlock } from "./schema";

/**
 * Default instance of the cta-1 block. Keys resolve under `blocks.cta-1.*`
 * at runtime via the messages aggregator. Spread over an `id` in a page
 * config to use the block with sample content.
 */
export const cta1Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-1",
  titleKey: "blocks.cta-1.title",
  bodyKey: "blocks.cta-1.body",
  emailPlaceholderKey: "blocks.cta-1.emailPlaceholder",
  submitLabelKey: "blocks.cta-1.submit",
};
