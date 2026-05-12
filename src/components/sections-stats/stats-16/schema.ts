import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` Stats — dotted world-map (with
 * pinned cities) on top, masked top + bottom; below it a 3-column
 * stat row with vertical hairline separators at @2xl. Each stat:
 * a large `value` + optional `suffix` (`%`, `X`) + a rich body.
 * Section is `data-theme="dark"`.
 */
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
