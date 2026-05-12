import type { MessageKey } from "@/types/messages";

export type TeamMember = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  avatarUrl: string;
};

export type TeamGroup = {
  /** Group heading like "Leadership", "Engineering", "Marketing". */
  headingKey: MessageKey;
  members: ReadonlyArray<TeamMember>;
};

export type TeamBlock = {
  type: "team-02";
  id: string;
  titleKey: MessageKey;
  groups: ReadonlyArray<TeamGroup>;
};
