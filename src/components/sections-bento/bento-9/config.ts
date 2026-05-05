import type { BentoBlock } from "./schema";

export const bento9Key = "bento-9" as const;
export const bento9Namespace = "blocks.bento-9" as const;

export const bento9Sample: Omit<BentoBlock, "id"> = {
  type: "bento-9",
  identityCell: {
    titleKey: "blocks.bento-9.identityCell.title",
    bodyKey: "blocks.bento-9.identityCell.body",
  },
  analyticsCell: {
    titleKey: "blocks.bento-9.analyticsCell.title",
    bodyKey: "blocks.bento-9.analyticsCell.body",
  },
  resourcesCell: {
    titleKey: "blocks.bento-9.resourcesCell.title",
    bodyKey: "blocks.bento-9.resourcesCell.body",
  },
  reliabilityCell: {
    titleKey: "blocks.bento-9.reliabilityCell.title",
    bodyKey: "blocks.bento-9.reliabilityCell.body",
  },
  feedbackCell: {
    titleKey: "blocks.bento-9.feedbackCell.title",
    bodyKey: "blocks.bento-9.feedbackCell.body",
  },
  communicationCell: {
    titleKey: "blocks.bento-9.communicationCell.title",
    bodyKey: "blocks.bento-9.communicationCell.body",
  },
};
