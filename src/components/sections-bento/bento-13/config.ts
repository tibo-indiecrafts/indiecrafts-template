import type { BentoBlock } from "./schema";

export const bento13Key = "bento-13" as const;
export const bento13Namespace = "blocks.bento-13" as const;

export const bento13Sample: Omit<BentoBlock, "id"> = {
  type: "bento-13",
  collaborationCell: {
    titleKey: "blocks.bento-13.collaborationCell.title",
    bodyKey: "blocks.bento-13.collaborationCell.body",
  },
  documentsCell: {
    titleKey: "blocks.bento-13.documentsCell.title",
    bodyKey: "blocks.bento-13.documentsCell.body",
  },
  financialCell: {
    titleKey: "blocks.bento-13.financialCell.title",
    bodyKey: "blocks.bento-13.financialCell.body",
  },
  chatCell: {
    titleKey: "blocks.bento-13.chatCell.title",
    bodyKey: "blocks.bento-13.chatCell.body",
  },
  schedulingCell: {
    titleKey: "blocks.bento-13.schedulingCell.title",
    bodyKey: "blocks.bento-13.schedulingCell.body",
  },
  filesharingCell: {
    titleKey: "blocks.bento-13.filesharingCell.title",
    bodyKey: "blocks.bento-13.filesharingCell.body",
  },
};
