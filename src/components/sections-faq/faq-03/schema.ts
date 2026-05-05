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

/**
 * Tailark `faq-3` — 2-column sticky-heading layout where each item has an
 * icon next to the question. Uses its own `Faq3Item` type because the icon
 * field isn't present on `faq-1`'s `FaqItem`.
 */
export type FaqBlock = {
  type: "faq-03";
  id: string;
  titleKey?: MessageKey;
  supportTextKey?: MessageKey;
  supportLinkKey?: MessageKey;
  supportHref?: string;
  items: readonly FaqItem[];
};
