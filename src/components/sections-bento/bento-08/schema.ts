import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-08";
  id: string;
  /** Top-left card: AI memory dashboard. Body supports inline `<strong>` markup. */
  smartHomeCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Bottom-left card: fingerprint side-by-side. */
  biometricCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Top-mid card: campaign illustration. Body supports inline `<strong>` markup. */
  marketingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Bottom-mid card: message-chat illustration. */
  messagingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Top-right card: chart illustration. */
  visualizationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Bottom-right card: models-row illustration. */
  feedbackCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
