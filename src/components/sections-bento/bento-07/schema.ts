import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-07";
  id: string;
  mapCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  fingerprintCell: { titleKey: MessageKey; bodyKey: MessageKey };
  memoryCell: { titleKey: MessageKey; bodyKey: MessageKey };
  uptimeCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
