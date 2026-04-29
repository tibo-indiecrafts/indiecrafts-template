import type { Team1Block } from "./schema";

/**
 * Default instance of the team-1 block. Avatar URLs are remote Unsplash
 * images — swap for your client's real headshots and add the hostname to
 * `next.config#images.remotePatterns` if still remote.
 */
export const team1Sample: Omit<Team1Block, "id"> = {
  type: "team-1",
  eyebrowKey: "blocks.team-1.eyebrow",
  titleKey: "blocks.team-1.title",
  introKey: "blocks.team-1.intro",
  linkLabelKey: "blocks.team-1.link",
  members: [
    {
      nameKey: "blocks.team-1.members.henry.name",
      roleKey: "blocks.team-1.members.henry.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-1.members.isabella.name",
      roleKey: "blocks.team-1.members.isabella.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1633625763717-045645e9e739?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-1.members.liam.name",
      roleKey: "blocks.team-1.members.liam.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1758922584983-82ffd5720c6a?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-1.members.olivia.name",
      roleKey: "blocks.team-1.members.olivia.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-1.members.ava.name",
      roleKey: "blocks.team-1.members.ava.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1605661107759-587d4bfdf168?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
    {
      nameKey: "blocks.team-1.members.elijah.name",
      roleKey: "blocks.team-1.members.elijah.role",
      avatarUrl:
        "https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=800&auto=format&fit=crop",
      href: "#",
    },
  ],
};
