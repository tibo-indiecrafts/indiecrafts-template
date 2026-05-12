import type { MessageKey } from "@/types/messages";

export type TableStatus = "in-progress" | "completed" | "planning" | "on-hold";

export type TablePerson = {
  name: string;
  initials: string;
};

export type TableTask = {
  id: string;
  task: string;
  budget: string;
  deadline: string;
  assigned: TablePerson[];
  status: TableStatus;
};

export type TableGroup = {
  nameKey: MessageKey;
  items: TableTask[];
};

export type TableBlock = {
  type: "table-04";
  id: string;

  titleKey: MessageKey;

  groups?: TableGroup[];
};
