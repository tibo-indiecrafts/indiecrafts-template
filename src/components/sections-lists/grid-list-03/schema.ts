import type { MessageKey } from "@/types/messages";

export type GridListIconName =
  | "ArrowRight"
  | "UserCircle"
  | "Server"
  | "CheckCircle"
  | "ContactRound"
  | "Hand";

export type GridListTone = "green" | "red" | "blue" | "sky" | "pink" | "orange";

export type GridListItem = {
  id: string;
  icon: GridListIconName;
  tone: GridListTone;

  href: string;
};

export type GridListBlock = {
  type: "grid-list-03";
  id: string;
  titleKey?: MessageKey;
  items?: GridListItem[];
};
