import type { Content6Block } from "./schema";

const avatarUrl = (n: number) => `https://randomuser.me/api/portraits/men/${n}.jpg`;

export const content6Sample: Omit<Content6Block, "id"> = {
  type: "content-6",
  titleKey: "blocks.content-6.title",
  bodyKey: "blocks.content-6.body",
  members: [
    {
      nameKey: "blocks.content-6.members.m1",
      avatarUrl: avatarUrl(1),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m2",
      avatarUrl: avatarUrl(2),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m3",
      avatarUrl: avatarUrl(3),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m4",
      avatarUrl: avatarUrl(4),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m5",
      avatarUrl: avatarUrl(5),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m6",
      avatarUrl: avatarUrl(6),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m7",
      avatarUrl: avatarUrl(7),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m8",
      avatarUrl: avatarUrl(8),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m9",
      avatarUrl: avatarUrl(9),
      href: "https://github.com",
    },
    {
      nameKey: "blocks.content-6.members.m10",
      avatarUrl: avatarUrl(10),
      href: "https://github.com",
    },
  ],
};
