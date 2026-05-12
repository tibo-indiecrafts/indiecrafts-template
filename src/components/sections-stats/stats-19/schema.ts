import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  /** Trailing text after the bold value (e.g. "Uptime guarantee.") — leading space included. */
  trailingKey: MessageKey;
};

export type StatsBlock = {
  type: "stats-19";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<StatItem>;
};
