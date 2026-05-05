import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/table-02` — task table with status badges and
 * row-level start/pause/complete/delete/view actions. Status & priority
 * are typed unions so badge styling stays statically known. Copy
 * (column headers, action labels, status labels) lives in en.json.
 */
export type TableStatus = "pending" | "in-progress" | "completed" | "blocked";
export type TablePriority = "low" | "medium" | "high" | "urgent";

export type TableTask = {
  id: string;
  title: string;
  assignee: string;
  status: TableStatus;
  priority: TablePriority;
  dueDate: string;
  notes: string;
};

export type TableActionType = "start" | "pause" | "complete" | "delete" | "view";

export type TableBlock = {
  type: "table-02";
  id: string;
  /** Visually-hidden caption / accessible name for the table. */
  titleKey: MessageKey;
  /** Tasks to render. Defaults to `table02Sample.tasks`. */
  tasks?: TableTask[];
  /**
   * Action handler. Receives the task and the requested action type.
   * Defaults to a no-op + console log so stories work without wiring.
   */
  onAction?: (task: TableTask, type: TableActionType) => void;
};
