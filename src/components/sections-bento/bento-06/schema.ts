import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-06";
  id: string;
  chartCell: { titleKey: MessageKey; bodyKey: MessageKey };
  messageCell: { titleKey: MessageKey; bodyKey: MessageKey };
  kitCell: {
    titleKey: MessageKey;
    /** Body MAY contain inline `<strong>` markup (rendered as foreground/medium). */
    bodyKey: MessageKey;
  };
};
