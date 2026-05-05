import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

/**
 * Tailark `stats-2` — filled muted cards.
 */
export type ContentBlock = {
  type: "content-10";
  id: string;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  items: readonly StatItem[];
};
