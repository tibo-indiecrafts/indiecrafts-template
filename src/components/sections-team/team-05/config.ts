import type { TeamBlock } from "./schema";

export const team05Key = "team-05" as const;
export const team05Namespace = "blocks.team-05" as const;

export const team05Sample: Omit<TeamBlock, "id"> = {
  type: "team-05",
  titleKey: "blocks.team-05.title",
  bodyKey: "blocks.team-05.body",
  members: [
    {
      nameKey: "blocks.team-05.members.1.name",
      roleKey: "blocks.team-05.members.1.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
    },
    {
      nameKey: "blocks.team-05.members.2.name",
      roleKey: "blocks.team-05.members.2.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
    },
    {
      nameKey: "blocks.team-05.members.3.name",
      roleKey: "blocks.team-05.members.3.role",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
    },
  ],
};
