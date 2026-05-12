import type { TeamBlock } from "./schema";

export const team03Key = "team-03" as const;
export const team03Namespace = "blocks.team-03" as const;

export const team03Sample: Omit<TeamBlock, "id"> = {
  type: "team-03",
  titleKey: "blocks.team-03.title",
  bodyKey: "blocks.team-03.body",
  cta: { labelKey: "blocks.team-03.cta", href: "#" },
  members: [
    {
      nameKey: "blocks.team-03.members.1.name",
      roleKey: "blocks.team-03.members.1.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
    },
    {
      nameKey: "blocks.team-03.members.2.name",
      roleKey: "blocks.team-03.members.2.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/31113941?v=4",
    },
    {
      nameKey: "blocks.team-03.members.3.name",
      roleKey: "blocks.team-03.members.3.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
    },
    {
      nameKey: "blocks.team-03.members.4.name",
      roleKey: "blocks.team-03.members.4.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
    },
    {
      nameKey: "blocks.team-03.members.5.name",
      roleKey: "blocks.team-03.members.5.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
    },
    {
      nameKey: "blocks.team-03.members.6.name",
      roleKey: "blocks.team-03.members.6.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/23456789?v=4",
    },
    {
      nameKey: "blocks.team-03.members.7.name",
      roleKey: "blocks.team-03.members.7.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/34567890?v=4",
    },
    {
      nameKey: "blocks.team-03.members.8.name",
      roleKey: "blocks.team-03.members.8.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/45678901?v=4",
    },
    {
      nameKey: "blocks.team-03.members.9.name",
      roleKey: "blocks.team-03.members.9.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/56789012?v=4",
    },
  ],
};
