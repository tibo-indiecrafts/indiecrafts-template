import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-10";
  id: string;
  messagingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  analyticsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  resourcesCell: { titleKey: MessageKey; bodyKey: MessageKey };

  kitCell: { titleKey: MessageKey; bodyKey: MessageKey };

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
