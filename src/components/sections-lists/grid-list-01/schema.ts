import type { MessageKey } from "@/types/messages";

export type GridListItem = {
  id: string;

  href: string;

  books: number;
};

export type GridListBlock = {
  type: "grid-list-01";
  id: string;
  titleKey?: MessageKey;
  items?: GridListItem[];
};
