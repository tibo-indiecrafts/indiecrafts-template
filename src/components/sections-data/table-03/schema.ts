import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/table-03` — product inventory table with a
 * category filter dropdown. Status is a typed union (badge styling stays
 * statically known); category list is derived from rows at render time.
 * Visible chrome (heading, description, filter placeholder, badge labels,
 * column headers, empty-state) all source from en.json.
 */
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
  /** Visible heading above the table. */
  titleKey: MessageKey;
  /** Subtitle / description under the heading. */
  descriptionKey: MessageKey;
  /** Products to render. Defaults to `table3Products`. */
  products?: TableProduct[];
};
