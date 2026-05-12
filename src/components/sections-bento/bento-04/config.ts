import type { BentoBlock } from "./schema";

export const bento04Key = "bento-04" as const;
export const bento04Namespace = "blocks.bento-04" as const;

export const bento04Sample: Omit<BentoBlock, "id"> = {
  type: "bento-04",
  shieldCell: {
    titleKey: "blocks.bento-04.shieldCell.title",
    bodyKey: "blocks.bento-04.shieldCell.body",
  },
  keysCell: {
    titleKey: "blocks.bento-04.keysCell.title",
    bodyKey: "blocks.bento-04.keysCell.body",
  },
  replyCell: {
    titleKey: "blocks.bento-04.replyCell.title",
    bodyKey: "blocks.bento-04.replyCell.body",
  },
  formulaCell: {
    titleKey: "blocks.bento-04.formulaCell.title",
    bodyKey: "blocks.bento-04.formulaCell.body",
  },
  leaderboardCell: {
    titleKey: "blocks.bento-04.leaderboardCell.title",
    bodyKey: "blocks.bento-04.leaderboardCell.body",
  },
  statCell: {
    percentKey: "blocks.bento-04.statCell.percent",
    labelKey: "blocks.bento-04.statCell.label",
  },
};
