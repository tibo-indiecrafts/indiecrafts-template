import type { BentoBlock } from "./schema";

export const bento6Key = "bento-6" as const;
export const bento6Namespace = "blocks.bento-6" as const;

export const bento6Sample: Omit<BentoBlock, "id"> = {
  type: "bento-6",
  chartCell: {
    titleKey: "blocks.bento-6.chartCell.title",
    bodyKey: "blocks.bento-6.chartCell.body",
  },
  messageCell: {
    titleKey: "blocks.bento-6.messageCell.title",
    bodyKey: "blocks.bento-6.messageCell.body",
  },
  kitCell: {
    titleKey: "blocks.bento-6.kitCell.title",
    bodyKey: "blocks.bento-6.kitCell.body",
  },
};
