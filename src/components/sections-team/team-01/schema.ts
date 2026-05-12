import type { MessageKey } from "@/types/messages";

export type TeamMember = {
  nameKey: MessageKey;
  roleKey: MessageKey;

  avatarUrl: string;

  href: string;
};

export type TeamBlock = {
  type: "team-01";
  id: string;
  eyebrowKey?: MessageKey;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  linkLabelKey?: MessageKey;
  members: TeamMember[];
};
