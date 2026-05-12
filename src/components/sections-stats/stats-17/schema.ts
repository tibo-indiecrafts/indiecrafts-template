import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  bodyKey: MessageKey;
};

export type StatsBlock = {
  type: "stats-17";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<StatItem>;
};
