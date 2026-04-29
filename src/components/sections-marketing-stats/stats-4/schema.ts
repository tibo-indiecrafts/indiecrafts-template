import type { MessageKey } from "@/types/messages";
import type { StatItem } from "@/components/sections-marketing-stats/stats-1/schema";

export type { StatItem };

/**
 * Tailark `stats-4` — editorial-style: heading + body on top, 2-column with
 * inline stats on the left and a testimonial quote on the right.
 */
export type Stats4Block = {
  type: "stats-4";
  id: string;
  titleKey: MessageKey;
  leadKey: MessageKey;
  supportingKey: MessageKey;
  /** Exactly two stats to balance with the quote. */
  items: readonly [StatItem, StatItem];
  quoteKey: MessageKey;
  authorKey: MessageKey;
};
