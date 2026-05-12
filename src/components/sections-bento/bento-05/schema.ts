import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-05";
  id: string;
  keysCell: { titleKey: MessageKey; bodyKey: MessageKey };
  chartCell: { titleKey: MessageKey; bodyKey: MessageKey };
  fingerprintCell: { titleKey: MessageKey; bodyKey: MessageKey };
  campaignCell: { titleKey: MessageKey; bodyKey: MessageKey };
  docsCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
