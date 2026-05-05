import type { BentoBlock } from "./schema";

export const bento5Key = "bento-5" as const;
export const bento5Namespace = "blocks.bento-5" as const;

export const bento5Sample: Omit<BentoBlock, "id"> = {
  type: "bento-5",
  keysCell: {
    titleKey: "blocks.bento-5.keysCell.title",
    bodyKey: "blocks.bento-5.keysCell.body",
  },
  chartCell: {
    titleKey: "blocks.bento-5.chartCell.title",
    bodyKey: "blocks.bento-5.chartCell.body",
  },
  fingerprintCell: {
    titleKey: "blocks.bento-5.fingerprintCell.title",
    bodyKey: "blocks.bento-5.fingerprintCell.body",
  },
  campaignCell: {
    titleKey: "blocks.bento-5.campaignCell.title",
    bodyKey: "blocks.bento-5.campaignCell.body",
  },
  docsCell: {
    titleKey: "blocks.bento-5.docsCell.title",
    bodyKey: "blocks.bento-5.docsCell.body",
  },
};
