import type { TeamBlock } from "./schema";

export const team01Key = "team-01" as const;
export const team01Namespace = "blocks.team-01" as const;

/**
 * Default instance of the team-1 block. Avatar URLs are remote Unsplash
 * images — swap for your client's real headshots and add the hostname to
 * `next.config#images.remotePatterns` if still remote.
 */
export const team01Sample: Omit<TeamBlock, "id"> = {
  type: "team-01",
  eyebrowKey: "blocks.team-01.eyebrow",
  titleKey: "blocks.team-01.title",
  introKey: "blocks.team-01.intro",
  linkLabelKey: "blocks.team-01.link",
  members: [
    {
      nameKey: "blocks.team-01.members.henry.name",
      roleKey: "blocks.team-01.members.henry.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-01.members.isabella.name",
      roleKey: "blocks.team-01.members.isabella.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1633625763717-045645e9e739?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-01.members.liam.name",
      roleKey: "blocks.team-01.members.liam.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1758922584983-82ffd5720c6a?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-01.members.olivia.name",
      roleKey: "blocks.team-01.members.olivia.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-01.members.ava.name",
      roleKey: "blocks.team-01.members.ava.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1605661107759-587d4bfdf168?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-01.members.elijah.name",
      roleKey: "blocks.team-01.members.elijah.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
  ],
};
