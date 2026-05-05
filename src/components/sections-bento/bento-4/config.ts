import type { BentoBlock } from "./schema";

export const bento4Key = "bento-4" as const;
export const bento4Namespace = "blocks.bento-4" as const;

export const bento4Sample: Omit<BentoBlock, "id"> = {
  type: "bento-4",
  shieldCell: {
    titleKey: "blocks.bento-4.shieldCell.title",
    bodyKey: "blocks.bento-4.shieldCell.body",
  },
  keysCell: {
    titleKey: "blocks.bento-4.keysCell.title",
    bodyKey: "blocks.bento-4.keysCell.body",
  },
  replyCell: {
    titleKey: "blocks.bento-4.replyCell.title",
    bodyKey: "blocks.bento-4.replyCell.body",
  },
  formulaCell: {
    titleKey: "blocks.bento-4.formulaCell.title",
    bodyKey: "blocks.bento-4.formulaCell.body",
  },
  leaderboardCell: {
    titleKey: "blocks.bento-4.leaderboardCell.title",
    bodyKey: "blocks.bento-4.leaderboardCell.body",
  },
  statCell: {
    percentKey: "blocks.bento-4.statCell.percent",
    labelKey: "blocks.bento-4.statCell.label",
  },
};
