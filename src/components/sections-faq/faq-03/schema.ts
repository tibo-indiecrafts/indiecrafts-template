import type { MessageKey } from "@/types/messages";

export type FaqIcon =
  | "clock"
  | "credit-card"
  | "truck"
  | "globe"
  | "package"
  | "shield"
  | "mail";

export type FaqItem = {
  id: string;
  icon: FaqIcon;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

export type FaqBlock = {
  type: "faq-03";
  id: string;
  titleKey?: MessageKey;
  supportTextKey?: MessageKey;
  supportLinkKey?: MessageKey;
  supportHref?: string;
  items: readonly FaqItem[];
};
