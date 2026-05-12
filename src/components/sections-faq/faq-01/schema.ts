import type { MessageKey } from "@/types/messages";

export type FaqItem = {
  id: string;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

export type FaqBlock = {
  type: "faq-01";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FaqItem[];
};
