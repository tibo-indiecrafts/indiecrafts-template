import type { MessageKey } from "@/types/messages";

export type ContentItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

export type ContentBlock = {
  type: "content-09";
  id: string;
  titleKey?: MessageKey;
  leadKey?: MessageKey;
  supportingKey?: MessageKey;

  items: readonly [ContentItem, ContentItem];
  quoteKey?: MessageKey;
  authorKey?: MessageKey;
};
