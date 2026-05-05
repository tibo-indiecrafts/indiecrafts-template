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
 *
 * All section-level MessageKey props are optional — they fall back to
 * the local `blocks.team-01.*` namespace when omitted. `members[]` keys
 * stay required full paths (data, not overrides).
 */
export type TeamBlock = {
  type: "team-01";
  id: string;
  eyebrowKey?: MessageKey;
  titleKey?: MessageKey;
  introKey?: MessageKey;
  linkLabelKey?: MessageKey;
  members: TeamMember[];
};
