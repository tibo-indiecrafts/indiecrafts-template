import type { BentoBlock } from "./schema";

export const bento12Key = "bento-12" as const;
export const bento12Namespace = "blocks.bento-12" as const;

export const bento12Sample: Omit<BentoBlock, "id"> = {
  type: "bento-12",
  financialCell: {
    titleKey: "blocks.bento-12.financialCell.title",
    bodyKey: "blocks.bento-12.financialCell.body",
  },
  filesharingCell: {
    titleKey: "blocks.bento-12.filesharingCell.title",
    bodyKey: "blocks.bento-12.filesharingCell.body",
  },
  chatCell: {
    titleKey: "blocks.bento-12.chatCell.title",
    bodyKey: "blocks.bento-12.chatCell.body",
  },
  collaborationCell: {
    titleKey: "blocks.bento-12.collaborationCell.title",
    bodyKey: "blocks.bento-12.collaborationCell.body",
  },
  schedulingCell: {
    titleKey: "blocks.bento-12.schedulingCell.title",
    bodyKey: "blocks.bento-12.schedulingCell.body",
  },
};
