import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/table-05` — full data table with sortable
 * columns, multi-select checkboxes, global text search, page-size
 * selector, and per-row dropdown actions (view/edit/delete). Built on
 * `@tanstack/react-table` for the table machinery.
 */
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
  /** Visually-hidden caption / accessible name. */
  titleKey: MessageKey;
  /** Items to render. Defaults to `table5Items`. */
  items?: TableItem[];
  /** Initial page size. Defaults to 5. */
  pageSize?: number;
};
