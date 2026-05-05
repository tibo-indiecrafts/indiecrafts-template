import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/table-04` — grouped task table (e.g. by team)
 * with avatar stacks, budget, deadline, and a colored status pill.
 * Status is a typed union so badge styling stays statically known;
 * group + status labels resolve from en.json.
 */
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
  /** Translation key for the group label (e.g. team name). */
  nameKey: MessageKey;
  items: TableTask[];
};

export type TableBlock = {
  type: "table-04";
  id: string;
  /** Visually-hidden caption / accessible name for the table. */
  titleKey: MessageKey;
  /** Grouped tasks. Defaults to `table4Groups`. */
  groups?: TableGroup[];
};
