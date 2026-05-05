import type { MessageKey } from "@/types/messages";

export type ContentItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

/**
 * Editorial content block: heading + body on top, 2-column with inline
 * stats on the left and a testimonial quote on the right. Originally
 * `stats-4` — moved into the content bucket because it's a marketing/
 * editorial section, not a data widget.
 */
export type ContentBlock = {
  type: "content-09";
  id: string;
  titleKey?: MessageKey;
  leadKey?: MessageKey;
  supportingKey?: MessageKey;
  /** Exactly two stats to balance with the quote. */
  items: readonly [ContentItem, ContentItem];
  quoteKey?: MessageKey;
  authorKey?: MessageKey;
};
