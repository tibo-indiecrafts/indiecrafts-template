import type { MessageKey } from "@/types/messages";

export type TableStatus = "completed" | "pending" | "processing" | "cancelled";

export type TableItem = {
  id: string;
  name: string;
  date: string;
  status: TableStatus;
  amount: string;
};

export type TableBlock = {
  type: "table-05";
  id: string;

  titleKey: MessageKey;

  items?: TableItem[];

  pageSize?: number;
};
