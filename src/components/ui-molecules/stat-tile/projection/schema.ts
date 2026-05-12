import type { MessageKey } from "@/types/messages";

export type ProjectionItem = {
  id: string;

  value: string;

  percentage: string;
};

export type ProjectionBlock = {
  type: "stats-15";
  id: string;
  titleKey?: MessageKey;
  items?: ProjectionItem[];
};
