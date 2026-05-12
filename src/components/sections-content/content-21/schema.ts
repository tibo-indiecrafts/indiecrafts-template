import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type CommunityMember = {
  nameKey: MessageKey;
  avatarSrc: string;
  href: StaticAppPathname | `http${string}` | `#${string}`;
};

export type ContentBlock = {
  type: "content-21";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  members: readonly CommunityMember[];
};
