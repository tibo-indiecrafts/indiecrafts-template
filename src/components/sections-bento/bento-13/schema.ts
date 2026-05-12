import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-13";
  id: string;
  collaborationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  financialCell: { titleKey: MessageKey; bodyKey: MessageKey };
  chatCell: { titleKey: MessageKey; bodyKey: MessageKey };
  schedulingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  filesharingCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
