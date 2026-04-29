import type { MessageKey } from "@/types/messages";

export type TeamMember = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  /** Public path or absolute URL (configure remote hosts in next.config#images.remotePatterns). */
  avatarUrl: string;
  /** External profile link. Not typed to StaticAppPathname — external-first. */
  href: string;
};

/**
 * Tailark `team-1` block converted to the typed/i18n pattern.
 * Editorial team grid with hover-reveal role + link label.
 */
export type Team1Block = {
  type: "team-1";
  id: string;
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  introKey: MessageKey;
  linkLabelKey: MessageKey;
  members: TeamMember[];
};
