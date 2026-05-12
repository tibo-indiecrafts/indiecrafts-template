import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  bodyKey: MessageKey;
};

export type StatsBlock = {
  type: "stats-18";
  id: string;
  items: ReadonlyArray<StatItem>;
};
