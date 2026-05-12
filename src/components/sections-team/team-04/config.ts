import type { TeamBlock } from "./schema";

export const team04Key = "team-04" as const;
export const team04Namespace = "blocks.team-04" as const;

export const team04Sample: Omit<TeamBlock, "id"> = {
  type: "team-04",
  titleKey: "blocks.team-04.title",
  bodyKey: "blocks.team-04.body",
  members: [
    {
      nameKey: "blocks.team-04.members.1.name",
      roleKey: "blocks.team-04.members.1.role",
      bioKey: "blocks.team-04.members.1.bio",
      avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
    },
    {
      nameKey: "blocks.team-04.members.2.name",
      roleKey: "blocks.team-04.members.2.role",
      bioKey: "blocks.team-04.members.2.bio",
      avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
    },
  ],
};
