import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type TeamMember = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  avatarUrl: string;
};

export type TeamBlock = {
  type: "team-03";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  members: ReadonlyArray<TeamMember>;
};
