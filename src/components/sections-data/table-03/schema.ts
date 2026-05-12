import type { MessageKey } from "@/types/messages";

export type TableStatus = "active" | "pending" | "discontinued" | "on-hold";

export type TableProduct = {
  sku: string;
  productName: string;
  stockLevel: number;
  category: string;
  status: TableStatus;
  unitPrice: string;
  lastRestocked: string;
};

export type TableBlock = {
  type: "table-03";
  id: string;

  titleKey: MessageKey;

  descriptionKey: MessageKey;

  products?: TableProduct[];
};
