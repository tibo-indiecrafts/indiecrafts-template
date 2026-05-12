import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;

  trailingKey: MessageKey;
};

export type StatsBlock = {
  type: "stats-19";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<StatItem>;
};
