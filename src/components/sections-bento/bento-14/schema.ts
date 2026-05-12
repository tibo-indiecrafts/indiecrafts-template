import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-14";
  id: string;
  currencyCell: {
    titleKey: MessageKey;
    bodyKey: MessageKey;
    metaLabelKey: MessageKey;
  };
  mapCell: { titleKey: MessageKey; bodyKey: MessageKey };
  monitoringCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
