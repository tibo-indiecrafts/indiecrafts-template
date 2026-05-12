import type { MessageKey } from "@/types/messages";

export type CommunityMember = {
  nameKey: MessageKey;
  avatarUrl: string;
  href: string;
};

export type ContentBlock = {
  type: "content-06";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  members: readonly CommunityMember[];
};
