import type { MessageKey } from "@/types/messages";

export type UsageItem = {
  id: string;

  stat: string;

  limit: string;

  percentage: number;
};

export type UsageBlock = {
  type: "stats-09";
  id: string;
  titleKey?: MessageKey;
  items?: UsageItem[];
};
