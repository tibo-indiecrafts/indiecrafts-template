import type { BentoBlock } from "./schema";

export const bento08Key = "bento-08" as const;
export const bento08Namespace = "blocks.bento-08" as const;

export const bento08Sample: Omit<BentoBlock, "id"> = {
  type: "bento-08",
  smartHomeCell: {
    titleKey: "blocks.bento-08.smartHomeCell.title",
    bodyKey: "blocks.bento-08.smartHomeCell.body",
  },
  biometricCell: {
    titleKey: "blocks.bento-08.biometricCell.title",
    bodyKey: "blocks.bento-08.biometricCell.body",
  },
  marketingCell: {
    titleKey: "blocks.bento-08.marketingCell.title",
    bodyKey: "blocks.bento-08.marketingCell.body",
  },
  messagingCell: {
    titleKey: "blocks.bento-08.messagingCell.title",
    bodyKey: "blocks.bento-08.messagingCell.body",
  },
  visualizationCell: {
    titleKey: "blocks.bento-08.visualizationCell.title",
    bodyKey: "blocks.bento-08.visualizationCell.body",
  },
  feedbackCell: {
    titleKey: "blocks.bento-08.feedbackCell.title",
    bodyKey: "blocks.bento-08.feedbackCell.body",
  },
};
