import type { BentoBlock } from "./schema";

export const bento7Key = "bento-7" as const;
export const bento7Namespace = "blocks.bento-7" as const;

export const bento7Sample: Omit<BentoBlock, "id"> = {
  type: "bento-7",
  mapCell: {
    titleKey: "blocks.bento-7.mapCell.title",
    bodyKey: "blocks.bento-7.mapCell.body",
  },
  documentsCell: {
    titleKey: "blocks.bento-7.documentsCell.title",
    bodyKey: "blocks.bento-7.documentsCell.body",
  },
  fingerprintCell: {
    titleKey: "blocks.bento-7.fingerprintCell.title",
    bodyKey: "blocks.bento-7.fingerprintCell.body",
  },
  memoryCell: {
    titleKey: "blocks.bento-7.memoryCell.title",
    bodyKey: "blocks.bento-7.memoryCell.body",
  },
  uptimeCell: {
    titleKey: "blocks.bento-7.uptimeCell.title",
    bodyKey: "blocks.bento-7.uptimeCell.body",
  },
};
