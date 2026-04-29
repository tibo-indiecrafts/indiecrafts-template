import type { MessageKey } from "@/types/messages";
import type { FaqItem } from "@/components/sections-marketing-faq/faq-1/schema";

export type { FaqItem };

/**
 * Tailark `faq-4` — softly-tinted accordion variant with peer-dashed separators.
 * Content shape matches `faq-1` / `faq-2`.
 */
export type Faq4Block = {
  type: "faq-4";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FaqItem[];
  supportTextKey?: MessageKey;
  supportLinkKey?: MessageKey;
  supportHref?: string;
};
