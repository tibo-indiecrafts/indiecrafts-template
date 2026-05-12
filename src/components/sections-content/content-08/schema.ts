import type { MessageKey } from "@/types/messages";

export type ContentItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

export type ContentBlock = {
  type: "content-08";
  id: string;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  items: ContentItem[];
};
