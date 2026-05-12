import type { BentoBlock } from "./schema";

export const bento09Key = "bento-09" as const;
export const bento09Namespace = "blocks.bento-09" as const;

export const bento09Sample: Omit<BentoBlock, "id"> = {
  type: "bento-09",
  identityCell: {
    titleKey: "blocks.bento-09.identityCell.title",
    bodyKey: "blocks.bento-09.identityCell.body",
  },
  analyticsCell: {
    titleKey: "blocks.bento-09.analyticsCell.title",
    bodyKey: "blocks.bento-09.analyticsCell.body",
  },
  resourcesCell: {
    titleKey: "blocks.bento-09.resourcesCell.title",
    bodyKey: "blocks.bento-09.resourcesCell.body",
  },
  reliabilityCell: {
    titleKey: "blocks.bento-09.reliabilityCell.title",
    bodyKey: "blocks.bento-09.reliabilityCell.body",
  },
  feedbackCell: {
    titleKey: "blocks.bento-09.feedbackCell.title",
    bodyKey: "blocks.bento-09.feedbackCell.body",
  },
  communicationCell: {
    titleKey: "blocks.bento-09.communicationCell.title",
    bodyKey: "blocks.bento-09.communicationCell.body",
  },
};
