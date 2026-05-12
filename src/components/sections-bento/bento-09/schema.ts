import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-09";
  id: string;
  identityCell: { titleKey: MessageKey; bodyKey: MessageKey };
  analyticsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  resourcesCell: { titleKey: MessageKey; bodyKey: MessageKey };
  reliabilityCell: { titleKey: MessageKey; bodyKey: MessageKey };
  feedbackCell: { titleKey: MessageKey; bodyKey: MessageKey };
  communicationCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
