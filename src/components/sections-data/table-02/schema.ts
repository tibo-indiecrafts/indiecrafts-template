import type { MessageKey } from "@/types/messages";

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

  titleKey: MessageKey;

  tasks?: TableTask[];

  onAction?: (task: TableTask, type: TableActionType) => void;
};
