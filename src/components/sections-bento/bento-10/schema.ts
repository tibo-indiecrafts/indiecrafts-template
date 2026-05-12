import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-10";
  id: string;
  messagingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  analyticsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  resourcesCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Spans 2 rows at @4xl. */
  kitCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Spans 2 cols at @2xl with embedded testimonial. */
  communicationCell: {
    titleKey: MessageKey;
    bodyKey: MessageKey;
    quoteKey: MessageKey;
    authorNameKey: MessageKey;
    authorAvatarUrl: string;
  };
  identityCell: { titleKey: MessageKey; bodyKey: MessageKey };
  uptimeCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
