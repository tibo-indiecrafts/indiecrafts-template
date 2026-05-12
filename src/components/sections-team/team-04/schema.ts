import type { MessageKey } from "@/types/messages";

export type TeamMember = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  bioKey: MessageKey;
  avatarUrl: string;
};

export type TeamBlock = {
  type: "team-04";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  members: ReadonlyArray<TeamMember>;
};
