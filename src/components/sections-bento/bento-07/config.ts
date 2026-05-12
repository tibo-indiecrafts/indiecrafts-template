import type { BentoBlock } from "./schema";

export const bento07Key = "bento-07" as const;
export const bento07Namespace = "blocks.bento-07" as const;

export const bento07Sample: Omit<BentoBlock, "id"> = {
  type: "bento-07",
  mapCell: {
    titleKey: "blocks.bento-07.mapCell.title",
    bodyKey: "blocks.bento-07.mapCell.body",
  },
  documentsCell: {
    titleKey: "blocks.bento-07.documentsCell.title",
    bodyKey: "blocks.bento-07.documentsCell.body",
  },
  fingerprintCell: {
    titleKey: "blocks.bento-07.fingerprintCell.title",
    bodyKey: "blocks.bento-07.fingerprintCell.body",
  },
  memoryCell: {
    titleKey: "blocks.bento-07.memoryCell.title",
    bodyKey: "blocks.bento-07.memoryCell.body",
  },
  uptimeCell: {
    titleKey: "blocks.bento-07.uptimeCell.title",
    bodyKey: "blocks.bento-07.uptimeCell.body",
  },
};
