import type { MessageKey } from "@/types/messages";

export type StatItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

export type Stats1Block = {
  type: "stats-1";
  id: string;
  titleKey: MessageKey;
  introKey: MessageKey;
  items: StatItem[];
};
