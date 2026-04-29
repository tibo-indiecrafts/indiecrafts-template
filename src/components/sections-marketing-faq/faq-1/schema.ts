import type { MessageKey } from "@/types/messages";

export type FaqItem = {
  id: string;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

/**
 * Tailark `faqs` — 2-column layout (heading left, Q&A list right on desktop).
 * Converted to the template pattern: props-driven content, MessageKey strings.
 */
export type Faq1Block = {
  type: "faq-1";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FaqItem[];
};
