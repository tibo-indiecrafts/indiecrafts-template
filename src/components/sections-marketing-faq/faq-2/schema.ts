import type { MessageKey } from "@/types/messages";
import type { FaqItem } from "@/components/sections-marketing-faq/faq-1/schema";

export type { FaqItem };

/**
 * Tailark `faq-2` — centered accordion card variant. Same content shape as
 * `faq-1`; only the visual treatment differs.
 */
export type Faq2Block = {
  type: "faq-2";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FaqItem[];
  /** Optional CTA under the accordion. */
  supportTextKey?: MessageKey;
  supportLinkKey?: MessageKey;
  supportHref?: string;
};
