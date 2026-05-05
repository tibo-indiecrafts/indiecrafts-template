import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

/**
 * Tailark `stats-3` — bordered card variant.
 */
export type ContentBlock = {
  type: "content-11";
  id: string;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  items: readonly StatItem[];
};
