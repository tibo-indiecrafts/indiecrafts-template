import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-12";
  id: string;
  financialCell: { titleKey: MessageKey; bodyKey: MessageKey };
  filesharingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  chatCell: { titleKey: MessageKey; bodyKey: MessageKey };
  collaborationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  schedulingCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
