import type { MessageKey } from "@/types/messages";
import type { StatItem } from "@/components/sections-marketing-stats/stats-1/schema";

export type { StatItem };

/**
 * Tailark `stats-2` — filled muted cards. Same content shape as `stats-1`.
 */
export type Stats2Block = {
  type: "stats-2";
  id: string;
  titleKey: MessageKey;
  introKey: MessageKey;
  items: readonly StatItem[];
};
