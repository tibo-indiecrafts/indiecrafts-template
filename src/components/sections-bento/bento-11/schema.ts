import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-11";
  id: string;
  financialCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  testimonialCell: {
    quoteKey: MessageKey;
    authorNameKey: MessageKey;
    authorHandleKey: MessageKey;
    authorAvatarUrl: string;
  };
  collaborationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  schedulingCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
