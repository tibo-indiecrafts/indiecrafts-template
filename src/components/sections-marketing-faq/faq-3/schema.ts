import type { MessageKey } from "@/types/messages";

export type Faq3Icon =
  | "clock"
  | "credit-card"
  | "truck"
  | "globe"
  | "package"
  | "shield"
  | "mail";

export type Faq3Item = {
  id: string;
  icon: Faq3Icon;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

/**
 * Tailark `faq-3` — 2-column sticky-heading layout where each item has an
 * icon next to the question. Uses its own `Faq3Item` type because the icon
 * field isn't present on `faq-1`'s `FaqItem`.
 */
export type Faq3Block = {
  type: "faq-3";
  id: string;
  titleKey: MessageKey;
  supportTextKey: MessageKey;
  supportLinkKey: MessageKey;
  supportHref: string;
  items: readonly Faq3Item[];
};
