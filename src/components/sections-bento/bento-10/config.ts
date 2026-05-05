import type { BentoBlock } from "./schema";

export const bento10Key = "bento-10" as const;
export const bento10Namespace = "blocks.bento-10" as const;

export const bento10Sample: Omit<BentoBlock, "id"> = {
  type: "bento-10",
  messagingCell: {
    titleKey: "blocks.bento-10.messagingCell.title",
    bodyKey: "blocks.bento-10.messagingCell.body",
  },
  analyticsCell: {
    titleKey: "blocks.bento-10.analyticsCell.title",
    bodyKey: "blocks.bento-10.analyticsCell.body",
  },
  resourcesCell: {
    titleKey: "blocks.bento-10.resourcesCell.title",
    bodyKey: "blocks.bento-10.resourcesCell.body",
  },
  kitCell: {
    titleKey: "blocks.bento-10.kitCell.title",
    bodyKey: "blocks.bento-10.kitCell.body",
  },
  communicationCell: {
    titleKey: "blocks.bento-10.communicationCell.title",
    bodyKey: "blocks.bento-10.communicationCell.body",
    quoteKey: "blocks.bento-10.communicationCell.quote",
    authorNameKey: "blocks.bento-10.communicationCell.authorName",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
  identityCell: {
    titleKey: "blocks.bento-10.identityCell.title",
    bodyKey: "blocks.bento-10.identityCell.body",
  },
  uptimeCell: {
    titleKey: "blocks.bento-10.uptimeCell.title",
    bodyKey: "blocks.bento-10.uptimeCell.body",
  },
};
