import type { MessageKey } from "@/types/messages";
import type { FaqItem } from "@/components/sections-faq/faq-01/schema";

export type { FaqItem };

/**
 * Tailark `faq-4` — softly-tinted accordion variant with peer-dashed separators.
 * Content shape matches `faq-1` / `faq-2`.
 */
export type FaqBlock = {
  type: "faq-04";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FaqItem[];
  supportTextKey?: MessageKey;
  supportLinkKey?: MessageKey;
  supportHref?: string;
};
