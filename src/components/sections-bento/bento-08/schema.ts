import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-08";
  id: string;

  smartHomeCell: { titleKey: MessageKey; bodyKey: MessageKey };

  biometricCell: { titleKey: MessageKey; bodyKey: MessageKey };

  marketingCell: { titleKey: MessageKey; bodyKey: MessageKey };

  messagingCell: { titleKey: MessageKey; bodyKey: MessageKey };

  visualizationCell: { titleKey: MessageKey; bodyKey: MessageKey };

  feedbackCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
