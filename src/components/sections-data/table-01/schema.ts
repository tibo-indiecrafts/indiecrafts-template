import type { MessageKey } from "@/types/messages";

export type TableRow = {
  id: string;
  name: string;
  category: string;
  value: number;
  date: string;
  children?: TableRow[];
};

export type TableBlock = {
  type: "table-01";
  id: string;

  titleKey: MessageKey;

  rows?: TableRow[];

  defaultOpenIndex?: number;
};
