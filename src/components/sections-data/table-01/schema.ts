import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/table-01` — collapsible grouped data table with
 * parent rows + nested children. Each row is non-translatable structured
 * data (ids, values, dates). The `titleKey` describes the table for the
 * accessible landmark; column header keys come from the same namespace.
 */
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
  /** Visually-hidden caption / accessible name for the `<table>`. */
  titleKey: MessageKey;
  /** Rows + nested children. Defaults to `table01Sample` when omitted. */
  rows?: TableRow[];
  /** Open the first row's children by default. */
  defaultOpenIndex?: number;
};
