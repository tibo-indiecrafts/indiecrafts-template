import type { BentoBlock } from "./schema";

export const bento8Key = "bento-8" as const;
export const bento8Namespace = "blocks.bento-8" as const;

export const bento8Sample: Omit<BentoBlock, "id"> = {
  type: "bento-8",
  smartHomeCell: {
    titleKey: "blocks.bento-8.smartHomeCell.title",
    bodyKey: "blocks.bento-8.smartHomeCell.body",
  },
  biometricCell: {
    titleKey: "blocks.bento-8.biometricCell.title",
    bodyKey: "blocks.bento-8.biometricCell.body",
  },
  marketingCell: {
    titleKey: "blocks.bento-8.marketingCell.title",
    bodyKey: "blocks.bento-8.marketingCell.body",
  },
  messagingCell: {
    titleKey: "blocks.bento-8.messagingCell.title",
    bodyKey: "blocks.bento-8.messagingCell.body",
  },
  visualizationCell: {
    titleKey: "blocks.bento-8.visualizationCell.title",
    bodyKey: "blocks.bento-8.visualizationCell.body",
  },
  feedbackCell: {
    titleKey: "blocks.bento-8.feedbackCell.title",
    bodyKey: "blocks.bento-8.feedbackCell.body",
  },
};
