import type { MessageKey } from "@/types/messages";

export type ContentItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

/**
 * Editorial "by-the-numbers" content block: heading + intro + a 3-column
 * grid of stat callouts. Originally `stats-1` — moved into the content
 * bucket because it's a marketing/editorial section, not a data widget.
 */
export type ContentBlock = {
  type: "content-08";
  id: string;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  items: ContentItem[];
};
