import type { BentoBlock } from "./schema";

export const bento11Key = "bento-11" as const;
export const bento11Namespace = "blocks.bento-11" as const;

export const bento11Sample: Omit<BentoBlock, "id"> = {
  type: "bento-11",
  financialCell: {
    titleKey: "blocks.bento-11.financialCell.title",
    bodyKey: "blocks.bento-11.financialCell.body",
  },
  documentsCell: {
    titleKey: "blocks.bento-11.documentsCell.title",
    bodyKey: "blocks.bento-11.documentsCell.body",
  },
  testimonialCell: {
    quoteKey: "blocks.bento-11.testimonialCell.quote",
    authorNameKey: "blocks.bento-11.testimonialCell.authorName",
    authorHandleKey: "blocks.bento-11.testimonialCell.authorHandle",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
  },
  collaborationCell: {
    titleKey: "blocks.bento-11.collaborationCell.title",
    bodyKey: "blocks.bento-11.collaborationCell.body",
  },
  schedulingCell: {
    titleKey: "blocks.bento-11.schedulingCell.title",
    bodyKey: "blocks.bento-11.schedulingCell.body",
  },
};
