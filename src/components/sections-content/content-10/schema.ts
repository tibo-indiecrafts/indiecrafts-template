import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

export type ContentBlock = {
  type: "content-10";
  id: string;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  items: readonly StatItem[];
};
