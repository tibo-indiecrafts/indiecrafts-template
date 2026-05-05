import type { BentoBlock } from "./schema";

export const bento14Key = "bento-14" as const;
export const bento14Namespace = "blocks.bento-14" as const;

export const bento14Sample: Omit<BentoBlock, "id"> = {
  type: "bento-14",
  currencyCell: {
    titleKey: "blocks.bento-14.currencyCell.title",
    bodyKey: "blocks.bento-14.currencyCell.body",
    metaLabelKey: "blocks.bento-14.currencyCell.metaLabel",
  },
  mapCell: {
    titleKey: "blocks.bento-14.mapCell.title",
    bodyKey: "blocks.bento-14.mapCell.body",
  },
  monitoringCell: {
    titleKey: "blocks.bento-14.monitoringCell.title",
    bodyKey: "blocks.bento-14.monitoringCell.body",
  },
  documentsCell: {
    titleKey: "blocks.bento-14.documentsCell.title",
    bodyKey: "blocks.bento-14.documentsCell.body",
  },
};
