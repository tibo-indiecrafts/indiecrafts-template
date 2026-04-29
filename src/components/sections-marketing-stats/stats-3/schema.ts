import type { MessageKey } from "@/types/messages";
import type { StatItem } from "@/components/sections-marketing-stats/stats-1/schema";

export type { StatItem };

/**
 * Tailark `stats-3` — bordered card variant. Same content shape as `stats-1`.
 */
export type Stats3Block = {
  type: "stats-3";
  id: string;
  titleKey: MessageKey;
  introKey: MessageKey;
  items: readonly StatItem[];
};
