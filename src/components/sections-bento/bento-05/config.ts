import type { BentoBlock } from "./schema";

export const bento05Key = "bento-05" as const;
export const bento05Namespace = "blocks.bento-05" as const;

export const bento05Sample: Omit<BentoBlock, "id"> = {
  type: "bento-05",
  keysCell: {
    titleKey: "blocks.bento-05.keysCell.title",
    bodyKey: "blocks.bento-05.keysCell.body",
  },
  chartCell: {
    titleKey: "blocks.bento-05.chartCell.title",
    bodyKey: "blocks.bento-05.chartCell.body",
  },
  fingerprintCell: {
    titleKey: "blocks.bento-05.fingerprintCell.title",
    bodyKey: "blocks.bento-05.fingerprintCell.body",
  },
  campaignCell: {
    titleKey: "blocks.bento-05.campaignCell.title",
    bodyKey: "blocks.bento-05.campaignCell.body",
  },
  docsCell: {
    titleKey: "blocks.bento-05.docsCell.title",
    bodyKey: "blocks.bento-05.docsCell.body",
  },
};
