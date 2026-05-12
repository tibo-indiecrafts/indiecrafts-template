import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-04";
  id: string;
  shieldCell: { titleKey: MessageKey; bodyKey: MessageKey };
  keysCell: { titleKey: MessageKey; bodyKey: MessageKey };
  replyCell: { titleKey: MessageKey; bodyKey: MessageKey };
  formulaCell: { titleKey: MessageKey; bodyKey: MessageKey };
  leaderboardCell: { titleKey: MessageKey; bodyKey: MessageKey };
  statCell: { percentKey: MessageKey; labelKey: MessageKey };
};
