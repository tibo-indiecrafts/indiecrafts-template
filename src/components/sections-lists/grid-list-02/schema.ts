import type { MessageKey } from "@/types/messages";

export type GridListPerson = {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;

  href?: string;
};

export type GridListBlock = {
  type: "grid-list-02";
  id: string;
  titleKey?: MessageKey;

  people?: GridListPerson[];
};
