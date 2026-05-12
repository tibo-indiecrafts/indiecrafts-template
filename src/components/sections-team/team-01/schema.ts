import type { MessageKey } from "@/types/messages";

export type TeamMember = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  /** Public path or absolute URL (configure remote hosts in next.config#images.remotePatterns). */
  avatarUrl: string;
  /** External profile link. Not typed to StaticAppPathname — external-first. */
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
