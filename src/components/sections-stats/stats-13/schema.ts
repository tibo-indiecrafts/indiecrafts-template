import type { MessageKey } from "@/types/messages";

export type StatsSegment = {
  id: string;

  value: number;

  color: string;
};

export type StatsBlock = {
  type: "stats-13";
  id: string;
  titleKey?: MessageKey;

  used?: number;

  total?: number;

  usedUnit?: string;

  totalUnit?: string;
  segments?: StatsSegment[];
};
