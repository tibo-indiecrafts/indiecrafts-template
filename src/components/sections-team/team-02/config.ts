import type { TeamBlock, TeamMember } from "./schema";

export const team02Key = "team-02" as const;
export const team02Namespace = "blocks.team-02" as const;

const MEMBERS: ReadonlyArray<TeamMember> = [
  {
    nameKey: "blocks.team-02.members.meschac.name",
    roleKey: "blocks.team-02.members.meschac.role",
    avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
  },
  {
    nameKey: "blocks.team-02.members.theo.name",
    roleKey: "blocks.team-02.members.theo.role",
    avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
  },
  {
    nameKey: "blocks.team-02.members.glodie.name",
    roleKey: "blocks.team-02.members.glodie.role",
    avatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
  },
  {
    nameKey: "blocks.team-02.members.bernard.name",
    roleKey: "blocks.team-02.members.bernard.role",
    avatarUrl: "https://avatars.githubusercontent.com/u/31113941?v=4",
  },
];

export const team02Sample: Omit<TeamBlock, "id"> = {
  type: "team-02",
  titleKey: "blocks.team-02.title",
  groups: [
    { headingKey: "blocks.team-02.groups.leadership", members: MEMBERS },
    { headingKey: "blocks.team-02.groups.engineering", members: MEMBERS },
    { headingKey: "blocks.team-02.groups.marketing", members: MEMBERS },
  ],
};
