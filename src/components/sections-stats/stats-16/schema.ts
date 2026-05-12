import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  suffixKey?: MessageKey;
  bodyKey: MessageKey;
};

export type StatsBlock = {
  type: "stats-16";
  id: string;
  items: ReadonlyArray<StatItem>;
};
