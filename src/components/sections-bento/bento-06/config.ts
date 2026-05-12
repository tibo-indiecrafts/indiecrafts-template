import type { BentoBlock } from "./schema";

export const bento06Key = "bento-06" as const;
export const bento06Namespace = "blocks.bento-06" as const;

export const bento06Sample: Omit<BentoBlock, "id"> = {
  type: "bento-06",
  chartCell: {
    titleKey: "blocks.bento-06.chartCell.title",
    bodyKey: "blocks.bento-06.chartCell.body",
  },
  messageCell: {
    titleKey: "blocks.bento-06.messageCell.title",
    bodyKey: "blocks.bento-06.messageCell.body",
  },
  kitCell: {
    titleKey: "blocks.bento-06.kitCell.title",
    bodyKey: "blocks.bento-06.kitCell.body",
  },
};
