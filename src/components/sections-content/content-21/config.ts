import type { ContentBlock } from "./schema";

export const content21Key = "content-21" as const;
export const content21Namespace = "blocks.content-21" as const;

const SHARED_HREF = "https://github.com/meschacirung";
const memberKey = "blocks.content-21.memberAriaLabel" as const;

export const content21Sample: Omit<ContentBlock, "id"> = {
  type: "content-21",
  titleKey: "blocks.content-21.title",
  bodyKey: "blocks.content-21.body",
  members: Array.from({ length: 11 }, (_, i) => ({
    nameKey: memberKey,
    // randomuser.me cycles through ~10 distinct portraits; this matches upstream.
    avatarSrc: `https://randomuser.me/api/portraits/men/${(i % 10) + 1}.jpg`,
    href: SHARED_HREF,
  })),
};
