import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  trailingKey: MessageKey;
};

export type StatsBlock = {
  type: "stats-20";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<StatItem>;
  /** Decorative globe / world-map image absolute-positioned to the bottom-right at sm+. */
  globeSrc: string;
};
